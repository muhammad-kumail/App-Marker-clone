import {StyleSheet, Text} from 'react-native';
import ImageView from 'react-native-image-viewing';
import React from 'react';
import theme, {scale} from '../../theme';

interface ShowImagesProps {
  visible?: boolean;
  data?: string[];
  currentIndex?: number;
  onClose?: () => void;
}

export default function ShowImages({
  visible = false,
  data = [],
  currentIndex = 0,
  onClose = () => null,
}: ShowImagesProps) {

  return (
    <ImageView
      images={data?.map(item => ({uri: item}))}
      keyExtractor={(item, index) => index?.toString()}
      imageIndex={currentIndex}
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      FooterComponent={item => (
        <Text style={styles.text}>
          {item?.imageIndex + 1}/{data?.length}
        </Text>
      )}
    />
  );
}

  const styles = StyleSheet.create({
    text: {
      color: 'white',
      alignSelf: 'center',
      padding: scale(2),
      marginBottom: scale(3),
      fontSize: theme.fontSizes.small,
    },
  });
