import {useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {toast} from '@/hooks/use-toast';
import {Button} from '@/components/ui/button';

interface FileUploadProps {
  setImageUrl: (url: string | null) => void;
  setImageFile: (file: File | null) => void;
}

export function FileUpload({setImageUrl, setImageFile}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0] as File;
    setFile(file);

    // Create a local URL for the file
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    setImageFile(file);
  }, [setImageUrl, setImageFile]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: {'image/*': ['.jpeg', '.png', '.jpg']}});

  return (
    <div {...getRootProps()} className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-md bg-muted hover:bg-accent cursor-pointer">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop an image here, or click to select files</p>
      }
      {file && (
        <div className="mt-2">
          <p>Selected file: {file.name}</p>
        </div>
      )}
    </div>
  );
}
