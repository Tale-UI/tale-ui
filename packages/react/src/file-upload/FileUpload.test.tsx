import { screen } from '@tale-ui/monorepo-tests/test-utils';
import { expect } from 'chai';
import { FileUpload } from '@tale-ui/react/file-upload';
import '../styles.css';
import { createRenderer, isJSDOM } from '#test-utils';

function getAverageChannelValue(color: string) {
  const channels = color.match(/\d+(?:\.\d+)?/g)?.slice(0, 3).map(Number) ?? [];
  return channels.reduce((total, channel) => total + channel, 0) / channels.length;
}

describe('<FileUpload />', () => {
  const { render } = createRenderer();

  it('provides an accessible name for the file input', async () => {
    await render(<FileUpload.DropZone />);

    expect(screen.getByLabelText('Upload files')).to.have.attribute('type', 'file');
  });

  it.skipIf(isJSDOM)('keeps the default light-surface layout readable', async () => {
    await render(
      <div style={{ width: '18.75rem' }}>
        <FileUpload.Root>
          <FileUpload.DropZone hint="Any file type accepted" />
          <FileUpload.List>
            <FileUpload.ListItemProgressFill
              key="uploading"
              name="design-system.fig"
              size={2_400_000}
              progress={65}
              onDelete={() => {}}
            />
            <FileUpload.ListItemProgressFill
              key="failed"
              name="corrupt.psd"
              size={1_200_000}
              progress={0}
              failed
              onDelete={() => {}}
              onRetry={() => {}}
            />
          </FileUpload.List>
        </FileUpload.Root>
      </div>,
    );

    const dropZone = document.querySelector('.tale-file-upload-drop-zone') as HTMLDivElement | null;
    const uploadItem = screen.getByText('design-system.fig').closest('li') as HTMLLIElement | null;
    const failedItem = screen.getByText('corrupt.psd').closest('li') as HTMLLIElement | null;

    expect(dropZone).not.to.equal(null);
    expect(uploadItem).not.to.equal(null);
    expect(failedItem).not.to.equal(null);

    const retryButton = failedItem?.querySelector('.tale-file-upload-item__retry-btn') as HTMLButtonElement | null;
    const failedMessage = failedItem?.querySelector('.tale-file-upload-item__size') as HTMLSpanElement | null;

    expect(retryButton).not.to.equal(null);
    expect(failedMessage).not.to.equal(null);

    const dropZoneBrightness = getAverageChannelValue(getComputedStyle(dropZone!).backgroundColor);
    const uploadItemBrightness = getAverageChannelValue(getComputedStyle(uploadItem!).backgroundColor);
    const failedItemWidth = failedItem!.getBoundingClientRect().width;
    const failedItemHeight = failedItem!.getBoundingClientRect().height;
    const retryButtonWidth = retryButton!.getBoundingClientRect().width;

    expect(dropZoneBrightness).to.be.greaterThan(200);
    expect(uploadItemBrightness).to.be.greaterThan(200);
    expect(failedItemHeight).to.be.greaterThan(56);
    expect(retryButtonWidth).to.be.lessThan(failedItemWidth / 2);
    expect(getComputedStyle(failedMessage!).whiteSpace).to.equal('normal');
  });
});
