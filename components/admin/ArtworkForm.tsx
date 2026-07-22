"use client";

import { useEffect, useState } from 'react';

export interface ArtworkFormValues {
  title: string;
  description: string;
  price: string;
  medium: string;
  width: string;
  height: string;
  category: string;
  quantity: string;
  availability: boolean;
  imageUrl?: string | null;
  imageFile?: File | null;
  removeImage?: boolean;
}

export function ArtworkForm({
  initialValues,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  errorMessage,
}: {
  initialValues: ArtworkFormValues;
  onSubmit: (values: ArtworkFormValues) => void;
  submitLabel: string;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}) {
  const [values, setValues] = useState(initialValues);
  const [previewUrl, setPreviewUrl] = useState(initialValues.imageUrl ?? '');
  const [uploadError, setUploadError] = useState('');

  useEffect(() => {
    setValues(initialValues);
    setPreviewUrl(initialValues.imageUrl ?? '');
  }, [initialValues]);

  const handleChange = (field: keyof ArtworkFormValues, value: string | boolean | File | null) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isValidType = validMimeTypes.includes(file.type);
    const isValidSize = file.size <= 5 * 1024 * 1024;

    if (!isValidType) {
      setUploadError('Please choose a JPEG, PNG, or WebP image file.');
      return;
    }

    if (!isValidSize) {
      setUploadError('Please choose an image smaller than 5MB.');
      return;
    }

    setUploadError('');
    setValues((prev) => ({ ...prev, imageFile: file, imageUrl: null }));
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setValues((prev) => ({ ...prev, imageFile: null, imageUrl: null }));
    setPreviewUrl('');
    setUploadError('');
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(values);
      }}
      className="space-y-5 rounded-[1.75rem] bg-white/85 p-6 shadow-[0_18px_50px_rgba(71,60,56,0.08)] sm:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-[#473C38]">
          Title
          <input
            value={values.title}
            onChange={(event) => handleChange('title', event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
            required
          />
        </label>
        <label className="text-sm font-medium text-[#473C38]">
          Price
          <input
            type="number"
            step="0.01"
            min="0"
            value={values.price}
            onChange={(event) => handleChange('price', event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
            required
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-[#473C38]">
        Description
        <textarea
          value={values.description}
          onChange={(event) => handleChange('description', event.target.value)}
          className="mt-1 min-h-28 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-[#473C38]">
          Medium
          <input
            value={values.medium}
            onChange={(event) => handleChange('medium', event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
          />
        </label>
        <label className="text-sm font-medium text-[#473C38]">
          Category
          <input
            value={values.category}
            onChange={(event) => handleChange('category', event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-[#473C38]">
          Quantity
          <input
            type="number"
            min="0"
            step="1"
            value={values.quantity}
            onChange={(event) => handleChange('quantity', event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
            required
          />
        </label>
        <label className="flex items-center gap-2 pt-8 text-sm text-[#473C38]">
          <input
            type="checkbox"
            checked={values.availability}
            onChange={(event) => handleChange('availability', event.target.checked)}
          />
          Available for sale
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-[#473C38]">
          Width
          <input
            type="number"
            step="0.01"
            value={values.width}
            onChange={(event) => handleChange('width', event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
          />
        </label>
        <label className="text-sm font-medium text-[#473C38]">
          Height
          <input
            type="number"
            step="0.01"
            value={values.height}
            onChange={(event) => handleChange('height', event.target.value)}
            className="mt-1 w-full rounded-xl border border-[#dbc9bd] bg-[#fffdfa] px-3 py-2 text-[#473C38] outline-none transition focus:border-[#B88A43]"
          />
        </label>
      </div>

      <div className="rounded-[1.25rem] bg-[#F5ECE6] p-4">
        <label className="block text-sm font-medium text-[#473C38]">
          Artwork Image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-[#6b5a55]"
          />
        </label>

        {uploadError ? <p className="mt-3 text-sm text-rose-700">{uploadError}</p> : null}

        {previewUrl ? (
          <div className="mt-4 flex flex-col gap-3 rounded-[1rem] border border-[#dbc9bd] bg-white/75 p-3">
            <div className="relative h-48 overflow-hidden rounded-[0.9rem] bg-[#f5ede8]">
              <img src={previewUrl} alt="Artwork preview" className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="w-fit rounded-full border border-[#d0b29e] px-4 py-2 text-sm text-[#473C38] transition hover:bg-[#F5ECE6]"
            >
              Remove image
            </button>
          </div>
        ) : null}
      </div>

      {errorMessage ? <p className="text-sm text-rose-700">{errorMessage}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-[#473C38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#362c29] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? 'Saving...' : submitLabel}
      </button>
    </form>
  );
}
