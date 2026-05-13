import React, { useState } from 'react';
import EquipmentCard from './components/EquipmentCard';
import DesignScanner from './components/ThreeDViewer';
import sampleComponents from './data/components.json';

const initialEquipment = [
  {
    _id: '1',
    name: 'ESP32 DevKitC',
    category: 'Microcontroller',
    status: true,
    imageURL: 'https://via.placeholder.com/320x180?text=ESP32',
  },
  {
    _id: '2',
    name: 'Arduino Uno',
    category: 'Microcontroller',
    status: false,
    imageURL: 'https://via.placeholder.com/320x180?text=Arduino',
  },
];

const App = () => {
  const [equipmentList, setEquipmentList] = useState(initialEquipment);

  const handleReserve = (equipmentId) => {
    setEquipmentList((prevList) =>
      prevList.map((item) =>
        item._id === equipmentId ? { ...item, status: false } : item
      )
    );
    alert('Reserve request sent. Backend checkout logic would run here.');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>Lab Reserve</h1>
        <p>View hardware, book devices, and scan 3D designs for printability.</p>
      </header>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Available Hardware</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {equipmentList.map((equipment) => (
            <EquipmentCard
              key={equipment._id}
              equipment={equipment}
              onReserve={handleReserve}
            />
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Hardware Data</h2>
        <ul>
          {sampleComponents.map((item) => (
            <li key={item.partNumber}>
              <strong>{item.name}</strong> — {item.specs} ({item.quantity} available)
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Design Scanner</h2>
        <DesignScanner />
      </section>
    </div>
  );
};

export default App;
