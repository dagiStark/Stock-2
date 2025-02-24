import { Input } from "@/components/ui/input";

interface ImageUploadProps {
  imagePreview: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImageUpload = ({ imagePreview, onImageChange }: ImageUploadProps) => {
  return (
    <>
      <Input
        type="file"
        accept="image/*"
        onChange={onImageChange}
        className="cursor-pointer"
      />
      {imagePreview && (
        <div className="mt-2">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full max-h-40 object-contain rounded-md"
          />
        </div>
      )}
    </>
  );
};

export default ImageUpload;