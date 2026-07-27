import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCropper, makeAspectCrop, centerCrop } from '@tale-ui/react/image-cropper';
import type { Crop, PixelCrop } from '@tale-ui/react/image-cropper';

type Args = {
  aspect: number | undefined;
  circularCrop: boolean;
  ruleOfThirds: boolean;
  disabled: boolean;
  locked: boolean;
};

const meta: Meta<Args> = {
  title: 'Components/ImageCropper',
  parameters: { layout: 'centered' },
  argTypes: {
    aspect: { control: { type: 'number', min: 0.1, step: 0.1 } },
    circularCrop: { control: 'boolean' },
    ruleOfThirds: { control: 'boolean' },
    disabled: { control: 'boolean' },
    locked: { control: 'boolean' },
  },
  args: {
    aspect: 16 / 9,
    circularCrop: false,
    ruleOfThirds: false,
    disabled: false,
    locked: false,
  },
};

export default meta;

type Story = StoryObj<Args>;

const DEMO_IMG = 'https://placehold.co/600x400/6366f1/ffffff?text=Crop+Me';

export const Default: Story = {
  render: (args) => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop} {...args}>
          <ImageCropper.Img src={DEMO_IMG} alt="Demo image" />
        </ImageCropper.Root>
      </div>
    );
  },
};

export const WithAspectRatio: Story = {
  name: 'With Aspect Ratio (16:9)',
  render: () => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop} aspect={16 / 9}>
          <ImageCropper.Img src={DEMO_IMG} alt="Demo image" />
        </ImageCropper.Root>
      </div>
    );
  },
};

export const CircularCrop: Story = {
  name: 'Circular Crop (1:1)',
  render: () => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 360 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop} aspect={1} circularCrop>
          <ImageCropper.Img
            src="https://placehold.co/400x400/6366f1/ffffff?text=Avatar"
            alt="Avatar crop"
            onLoad={(entry) => {
              const { naturalWidth: w, naturalHeight: h } = entry.currentTarget;
              const initial = centerCrop(makeAspectCrop({ unit: '%', width: 80 }, 1, w, h), w, h);
              setCrop(initial);
            }}
          />
        </ImageCropper.Root>
      </div>
    );
  },
};

export const WithRuleOfThirds: Story = {
  name: 'Rule of Thirds',
  render: () => {
    const [crop, setCrop] = React.useState<Crop>();
    return (
      <div style={{ maxWidth: 480 }}>
        <ImageCropper.Root crop={crop} onChange={setCrop} ruleOfThirds>
          <ImageCropper.Img src={DEMO_IMG} alt="Demo image" />
        </ImageCropper.Root>
      </div>
    );
  },
};
