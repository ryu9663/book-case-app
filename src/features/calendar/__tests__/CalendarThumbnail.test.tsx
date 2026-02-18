import React from 'react';
import { render } from '@testing-library/react-native';
import { CalendarThumbnail } from '../components/CalendarThumbnail';

jest.mock('@/lib/theme/colors', () => ({
  getSpineColor: (title: string) =>
    title === '책1' ? '#AA5533' : '#3355AA',
}));

describe('CalendarThumbnail', () => {
  it('썸네일 이미지가 있으면 Image 렌더링', () => {
    const { getByTestId } = render(
      <CalendarThumbnail
        title="책1"
        thumbnail="https://example.com/thumb.jpg"
      />,
    );

    const image = getByTestId('calendar-thumbnail-image');
    expect(image.props.source).toEqual({
      uri: 'https://example.com/thumb.jpg',
    });
  });

  it('썸네일이 없으면 getSpineColor 색상 블록 렌더링', () => {
    const { getByTestId } = render(
      <CalendarThumbnail title="책1" thumbnail={null} />,
    );

    const colorBlock = getByTestId('calendar-thumbnail-color');
    expect(colorBlock.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#AA5533' }),
      ]),
    );
  });

  it('thumbnail이 undefined여도 색상 블록 렌더링', () => {
    const { getByTestId } = render(
      <CalendarThumbnail title="책2" thumbnail={undefined} />,
    );

    const colorBlock = getByTestId('calendar-thumbnail-color');
    expect(colorBlock.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ backgroundColor: '#3355AA' }),
      ]),
    );
  });
});
