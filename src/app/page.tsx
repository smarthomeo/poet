'use client';

import {useState} from 'react';
import {useToast} from '@/hooks/use-toast';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {FileUpload} from '@/components/file-upload';
import {Separator} from '@/components/ui/separator';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';

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
  const [poem, setPoem] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {toast} = useToast();
  const [selectedTone, setSelectedTone] = useState<string>('');

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tone: '',
    },
  });

  const handleGeneratePoem = async () => {
    if (!imageUrl) {
      toast({
        title: 'Error',
        description: 'Please upload an image first.',
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would normally call the Genkit flow, but since we're disabling Genkit:
      // 1. Remove the call to generatePoem or generatePoemWithTone
      // 2. Replace with a placeholder poem.
      // let poemResult;
      // if (selectedTone) {
      //   poemResult = await generatePoemWithTone({imageUrl: imageUrl, tone: selectedTone});
      // } else {
      //   poemResult = await generatePoem({imageUrl: imageUrl});
      // }
      // setPoem(poemResult?.poem || 'Failed to generate poem.');
      
      // Set a placeholder poem instead
      setPoem('This is a placeholder poem. GenAI features are disabled.');

      toast({
        title: 'Poem Generated',
        description: 'Your poem has been generated successfully!',
      });
    } catch (error: any) {
      console.error('Poem generation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate poem.',
      });
    } finally {
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

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-secondary py-10">
      <Card className="w-full max-w-3xl bg-card shadow-md rounded-lg overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-semibold tracking-tight">PhotoPoet</CardTitle>
          <CardDescription>Generate poems from your photos.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <FileUpload setImageUrl={setImageUrl} />
            </div>
            <div className="flex-1">
              <Select onValueChange={setSelectedTone}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Tone"/>
                </SelectTrigger>
                <SelectContent>
                  {toneOptions.map(tone => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleGeneratePoem}
                disabled={loading}
                className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/80"
              >
                {loading ? 'Generating...' : 'Generate Poem'}
              </Button>
            </div>
          </div>

          {imageUrl && (
            <div className="flex justify-center">
              <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto rounded-md shadow-md"/>
            </div>
          )}
          <Separator/>
          <div>
            <Textarea
              readOnly
              placeholder="Your poem will appear here..."
              value={poem}
              className="w-full h-48 bg-input rounded-md text-base"/>
          </div>
          <Button
            onClick={handleDownloadPoem}
            disabled={!poem}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/80"
          >
            Download Poem
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
