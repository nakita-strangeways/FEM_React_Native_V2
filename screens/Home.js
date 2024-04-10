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
  const customPalette = route.params ? route.params.customPalette : null;

  const [colorPalletes, setColorPalletes] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  useEffect(() => {
    if (customPalette) {
      setColorPalletes((current) => [customPalette, ...current]);
    }
  }, [customPalette]);

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
          style={styles.button}
          onPress={() => {
            navigation.navigate('AddNewPalette');
          }}
        >
          <Text style={styles.buttonText}>Add a Color Palette</Text>
        </TouchableOpacity>
      }
    />
  );
};

const styles = StyleSheet.create({
  list: { padding: 10, backgroundColor: 'white' },
  button: {
    height: 40,
    backgroundColor: 'teal',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Home;
