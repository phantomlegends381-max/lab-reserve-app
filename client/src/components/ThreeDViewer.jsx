import React, { useState } from 'react';

const DesignScanner = () => {
  const [fileName, setFileName] = useState('');
  const [status, setStatus] = useState('No design uploaded yet.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setFileName(file.name);
    setStatus('Analyzing design...');
    setIsAnalyzing(true);

    // Simulate a simple AI analysis sequence with a timeout.
    setTimeout(() => {
      const extension = file.name.split('.').pop().toLowerCase();
      const supports3D = ['stl', 'obj'];

      if (!supports3D.includes(extension)) {
        setStatus('Unsupported file type. Please upload STL or OBJ.');
      } else {
        setStatus('Design looks good for 3D printing. No major issues found.');
      }
      setIsAnalyzing(false);
    }, 1400);
  };

  return (
    <div style={{ maxWidth: '420px', padding: '1rem', border: '1px solid #ccc', borderRadius: '10px' }}>
      <h2>Design Scanner</h2>
      <p style={{ color: '#555' }}>Upload an STL or OBJ file to simulate AI printability analysis.</p>

      <input type="file" accept=".stl,.obj" onChange={handleFileChange} />

      <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: '#f7f7f7' }}>
        <strong>Status:</strong>
        <div style={{ marginTop: '0.5rem', color: isAnalyzing ? '#0d6efd' : '#212529' }}>{status}</div>
      </div>

      {fileName && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: '#666' }}>
          Uploaded file: {fileName}
        </div>
      )}
    </div>
  );
};

export default DesignScanner;
