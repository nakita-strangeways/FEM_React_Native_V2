import React, { useCallback, useEffect, useState } from 'react';
import {
  RefreshControl,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import PalettePreview from '../components/PalettePreview';

const Home = ({ navigation, route }) => {
  const [colorPalletes, setColorPalletes] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // const { newPalette } = route.params;
  // console.log(newPalette);

  const handleFetchPalettes = useCallback(async () => {
    const result = await fetch(
      'https://color-palette-api.kadikraman.vercel.app/palettes',
    );
    const colorPalleteList = await result.json();
    if (result.ok) {
      setColorPalletes(colorPalleteList);
    }
  });

  setTimeout(() => {
    setIsRefreshing(false);
  }, 1000);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await handleFetchPalettes();
    setIsRefreshing(false);
  });

  useEffect(() => {
    handleFetchPalettes();
  }, []);

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
      style={styles.list}
      data={colorPalletes}
      keyExtractor={(item) => item.paletteName}
      renderItem={({ item }) => (
        <PalettePreview
          onPress={() => navigation.navigate('ColorPalette', item)}
          palette={item}
        />
      )}
      ListHeaderComponent={
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AddNewPalette');
          }}
        >
          <Text style={styles.modalButton}>Add a Color Palette</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 10, backgroundColor: 'white' },
  modalButton: { color: 'blue' },
});

export default Home;
