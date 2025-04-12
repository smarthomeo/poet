'use client';

import {useState, useRef, useEffect} from 'react';
import {useToast} from '@/hooks/use-toast';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Textarea} from '@/components/ui/textarea';
import {FileUpload} from '@/components/file-upload';
import {Separator} from '@/components/ui/separator';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {Slider} from '@/components/ui/slider';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {generatePoem} from '@/ai/flows/poem-generation';
import { Wand2, Volume2, Download, Pause, Play } from 'lucide-react';

const toneOptions = [
  'happy',
  'sad',
  'reflective',
  'angry',
  'inspirational',
  'romantic',
  'humorous',
  'melancholic',
];

const formSchema = z.object({
  tone: z.string().optional(),
});

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [poem, setPoem] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isReading, setIsReading] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<string>('Rachel');
  const [stability, setStability] = useState<number>(0.5);
  const [similarityBoost, setSimilarityBoost] = useState<number>(0.5);
  const [volume, setVolume] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);
  const [numStanzas, setNumStanzas] = useState<number>(3);
  const [linesPerStanza, setLinesPerStanza] = useState<number>(4);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const {toast} = useToast();
  const [selectedTone, setSelectedTone] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: '',
    },
  });

  const handleGeneratePoem = async () => {
    if (!imageFile) {
      toast({
        title: 'Error',
        description: 'Please upload an image first.',
      });
      return;
    }

    setLoading(true);
    try {
      // Convert the image file to base64
      const fileReader = new FileReader();
      fileReader.onload = async (event) => {
        const base64Image = event.target?.result as string;

        const poemResult = await generatePoem({
          imageUrl: base64Image,
          tone: selectedTone,
          numStanzas,
          linesPerStanza,
        });
        setPoem(poemResult?.poem || 'Failed to generate poem.');

        toast({
          title: 'Poem Generated',
          description: 'Your poem has been generated successfully!',
        });
        setLoading(false);
      };
      fileReader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast({
          title: 'Error',
          description: 'Failed to read the image file.',
        });
        setLoading(false);
      };
      fileReader.readAsDataURL(imageFile);
    } catch (error: any) {
      console.error('Poem generation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate poem.',
      });
      setLoading(false);
    }
  };

  const handleDownloadPoem = () => {
    if (!poem) {
      toast({
        title: 'Error',
        description: 'No poem to download. Please generate a poem first.',
      });
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([poem], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'poem.txt';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const handleReadPoem = async () => {
    if (!poem) {
      toast({
        title: 'Error',
        description: 'No poem to read. Please generate a poem first.',
      });
      return;
    }

    setIsReading(true);
    try {
      const response = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text: poem,
          voice: selectedVoice,
          stability,
          similarity_boost: similarityBoost,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audio.volume = volume;
      audioRef.current = audio;

      // Update progress
      audio.ontimeupdate = () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      audio.onended = () => {
        setIsReading(false);
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
        setProgress(0);
      };

      await audio.play();
    } catch (error) {
      console.error('Error reading poem:', error);
      toast({
        title: 'Error',
        description: 'Failed to read the poem.',
      });
      setIsReading(false);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleStopReading = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsReading(false);
      setProgress(0);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Panel - Image Upload and Settings */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                PhotoPoet
              </h1>
              <p className="text-gray-400 mb-6">Transform your photos into poetic masterpieces</p>
              
              <div className="space-y-6">
              <FileUpload setImageUrl={setImageUrl} setImageFile={setImageFile} />
                
                {imageUrl && (
                  <div className="relative aspect-square rounded-xl overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt="Uploaded" 
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Settings Panel */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Poem Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Tone</label>
              <Select onValueChange={setSelectedTone}>
                    <SelectTrigger className="w-full bg-gray-700/50 border-gray-600">
                  <SelectValue placeholder="Select a Tone"/>
                </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                  {toneOptions.map(tone => (
                        <SelectItem key={tone} value={tone} className="hover:bg-gray-700">
                          {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Stanzas ({numStanzas})</label>
                    <Slider
                      value={[numStanzas]}
                      onValueChange={(value) => setNumStanzas(value[0])}
                      min={1}
                      max={10}
                      step={1}
                      className="text-purple-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-300 mb-2 block">Lines per Stanza ({linesPerStanza})</label>
                    <Slider
                      value={[linesPerStanza]}
                      onValueChange={(value) => setLinesPerStanza(value[0])}
                      min={2}
                      max={10}
                      step={1}
                      className="text-purple-500"
                    />
                  </div>
                </div>

              <Button
                onClick={handleGeneratePoem}
                  disabled={loading || !imageFile}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <Wand2 className="w-5 h-5 mr-2 animate-pulse" />
                      Generating...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Poem
                    </span>
                  )}
              </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Poem Display and Voice Controls */}
          <div className="w-full lg:w-2/3 space-y-6">
            {/* Poem Display */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h2 className="text-xl font-semibold mb-4">Your Poem</h2>
              <div className="relative">
            <Textarea
              readOnly
                  placeholder="Your generated poem will appear here..."
              value={poem}
                  className="w-full h-96 bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 rounded-xl p-4 text-lg leading-relaxed resize-none"
                />
                {poem && (
                  <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            onClick={handleDownloadPoem}
                      className="bg-gray-700/50 hover:bg-gray-600/50 text-white p-2 rounded-lg transition-all duration-300"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Voice Controls */}
            {poem && (
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h2 className="text-xl font-semibold mb-4">Voice Settings</h2>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Voice</label>
                      <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                        <SelectTrigger className="w-full bg-gray-700/50 border-gray-600">
                          <SelectValue placeholder="Select a voice"/>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="Rachel" className="hover:bg-gray-700">Rachel</SelectItem>
                          <SelectItem value="Domi" className="hover:bg-gray-700">Domi</SelectItem>
                          <SelectItem value="Bella" className="hover:bg-gray-700">Bella</SelectItem>
                          <SelectItem value="Antoni" className="hover:bg-gray-700">Antoni</SelectItem>
                          <SelectItem value="Josh" className="hover:bg-gray-700">Josh</SelectItem>
                          <SelectItem value="Arnold" className="hover:bg-gray-700">Arnold</SelectItem>
                          <SelectItem value="Adam" className="hover:bg-gray-700">Adam</SelectItem>
                          <SelectItem value="Sam" className="hover:bg-gray-700">Sam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Volume</label>
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-gray-400" />
                        <Slider
                          value={[volume]}
                          onValueChange={handleVolumeChange}
                          min={0}
                          max={1}
                          step={0.1}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Stability ({stability.toFixed(1)})</label>
                      <Slider
                        value={[stability]}
                        onValueChange={(value) => setStability(value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">Similarity Boost ({similarityBoost.toFixed(1)})</label>
                      <Slider
                        value={[similarityBoost]}
                        onValueChange={(value) => setSimilarityBoost(value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {isReading && (
                    <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={handleReadPoem}
                      disabled={isReading}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      {isReading ? (
                        <span className="flex items-center justify-center">
                          <Pause className="w-5 h-5 mr-2" />
                          Pause
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Play className="w-5 h-5 mr-2" />
                          Read Poem
                        </span>
                      )}
                    </Button>
                    {isReading && (
                      <Button
                        onClick={handleStopReading}
                        className="flex-1 bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                      >
                        Stop
          </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
