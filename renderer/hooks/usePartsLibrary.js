import { useState, useEffect } from 'react';

export default function usePartsLibrary() {
  const [partsLibrary, setPartsLibrary] = useState([]);
  const [presetStock, setPresetStock] = useState([]);
  const [workbenchParts, setWorkbenchParts] = useState(new Map());
  
  useEffect(() => {
    const fetchPartsLibrary = async () => {
      try {
        const response = await fetch('./parts_library.json');
        const data = await response.json();
        setPartsLibrary(data);
      } catch (error) {
        console.error('Error fetching parts library:', error);
      }
    };
    
    const fetchPresetStock = async () => {
      try {
        const response = await fetch('./pre_set_stock.json');
        const data = await response.json();
        setPresetStock(data);
      } catch (error) {
        console.error('Error fetching preset stock:', error);
      }
    };
    
    fetchPartsLibrary();
    fetchPresetStock();
  }, []);
  
  const addWorkbenchPart = (partId, partData) => {
    setWorkbenchParts(prev => {
      const newMap = new Map(prev);
      newMap.set(partId, partData);
      return newMap;
    });
  };
  
  const generateUid = () => {
    return `shape_${new Date().getTime()}_${Math.floor(Math.random() * 1000)}`;
  };
  
  return {
    partsLibrary,
    presetStock,
    workbenchParts,
    addWorkbenchPart,
    generateUid
  };
}
