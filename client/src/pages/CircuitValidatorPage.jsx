/**
 * CIRCUIT VALIDATOR PAGE
 * 
 * Dedicated page for testing hardware circuit safety
 * Users can:
 * 1. Upload BOM files (JSON, CSV, Fritzing)
 * 2. Manually enter component list
 * 3. Get instant hardware safety validation
 * 4. See detailed warnings and recommendations
 * 5. Learn about proper circuit design
 * 
 * FEATURES:
 * - Drag-and-drop file upload
 * - Multiple file format support
 * - Real-time validation feedback
 * - Color-coded safety scores
 * - Educational warnings
 * - Component database lookup
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { safeJsonFetch } from '../utils/api';

/**
 * EXAMPLE BOM DATA
 * Pre-filled example for testing
 */
const EXAMPLE_BOM = `[
  { "id": "host-1", "partNumber": "MCU-ESP32-WROOM32", "quantity": 1 },
  { "id": "sensor-1", "partNumber": "SNS-HCSR04-5V", "quantity": 1, "suppliedBy": "host-1" }
]`;

function parseBomInput(fileContent) {
  const parsed = JSON.parse(fileContent);
  if (Array.isArray(parsed)) return { components: parsed };
  return parsed;
}

function getResultScore(result) {
  return result?.circuitSafetyScore ?? result?.safetyScore ?? 0;
}

function CircuitValidatorPage() {
  // ===== STATE =====
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState('');
  const [fileType, setFileType] = useState('json');
  const [manualInput, setManualInput] = useState('');
  const [useManual, setUseManual] = useState(false);

  // ===== EVENT HANDLERS =====
  /**
   * handleFileSelect
   * When user selects a file from input
   */
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError('');
    setValidationResult(null);

    // Detect file type from extension
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext === 'json') setFileType('json');
    else if (ext === 'csv') setFileType('csv');
    else if (ext === 'fzz') setFileType('fritzing');
    else setFileType('text');
  };

  /**
   * handleDragOver
   * Visual feedback for drag-and-drop
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  /**
   * handleDragLeave
   * Remove drag-and-drop visual feedback
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  /**
   * handleDrop
   * Handle drop of files
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect({ target: { files: droppedFiles } });
    }
  };

  /**
   * handleValidate
   * Send file to backend for validation
   */
  const handleValidate = async () => {
    try {
      setLoading(true);
      setError('');
      setValidationResult(null);

      let fileContent = '';
      let detectedFileType = fileType;

      if (useManual) {
        fileContent = manualInput;
        detectedFileType = 'json';
      } else if (file) {
        fileContent = await file.text();
      } else {
        setError('Please upload a file or enter component data');
        setLoading(false);
        return;
      }

      const payload = detectedFileType === 'json'
        ? parseBomInput(fileContent)
        : { fileContent, fileType: detectedFileType };

      // Call backend validation API
      const data = await safeJsonFetch('/api/verify-schema', {
        method: 'POST',
        throwOnHttpError: false,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      setValidationResult(data);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleLoadExample
   * Load pre-filled example data
   */
  const handleLoadExample = () => {
    setUseManual(true);
    setManualInput(EXAMPLE_BOM);
    setFile(null);
    setFileName('');
    setError('');
    setValidationResult(null);
  };

  /**
   * getSafetyColor
   * Return color based on safety score
   */
  const getSafetyColor = (score) => {
    if (score >= 80) return 'green';
    if (score >= 50) return 'yellow';
    if (score >= 20) return 'orange';
    return 'red';
  };

  /**
   * getSafetyBadge
   * Return CSS classes for safety score badge
   */
  const getSafetyBadge = (score) => {
    const color = getSafetyColor(score);
    const bgMap = {
      green: 'bg-green-100 text-green-900 border-green-300',
      yellow: 'bg-yellow-100 text-yellow-900 border-yellow-300',
      orange: 'bg-orange-100 text-orange-900 border-orange-300',
      red: 'bg-red-100 text-red-900 border-red-300'
    };
    return bgMap[color];
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold text-blue-600">⚡ Lab-Reserve</div>
            <div className="text-sm text-gray-600">Circuit Validator</div>
          </Link>
          <Link
            to="/"
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🔧 Circuit Safety Validator
          </h1>
          <p className="text-gray-600">
            Upload your circuit BOM or component list to check for safety issues before building.
            Our validator checks for voltage mismatches, current overloads, and component compatibility.
          </p>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: FILE UPLOAD */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">📤 Upload BOM</h2>

              {/* FILE UPLOAD AREA */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center transition-colors cursor-pointer hover:border-blue-400"
              >
                <div className="text-4xl mb-2">📁</div>
                <p className="text-sm text-gray-600 mb-2">
                  Drop your BOM file here or click to select
                </p>
                <input
                  type="file"
                  accept=".json,.csv,.tsv,.fzz,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-input"
                />
                <label
                  htmlFor="file-input"
                  className="text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Choose File
                </label>
              </div>

              {/* SELECTED FILE INFO */}
              {fileName && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-semibold text-blue-900">✓ {fileName}</p>
                  <p className="text-xs text-blue-700 mt-1">Type: {fileType}</p>
                </div>
              )}

              {/* FILE FORMAT INFO */}
              <div className="mt-6 p-3 bg-gray-100 rounded-lg">
                <p className="text-xs font-semibold text-gray-700 mb-2">Supported Formats:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>✓ JSON (BOM array)</li>
                  <li>✓ CSV (component, qty)</li>
                  <li>✓ Fritzing (.fzz)</li>
                  <li>✓ Plain text</li>
                </ul>
              </div>

              {/* OR MANUAL INPUT */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <button
                  onClick={() => {
                    setUseManual(!useManual);
                    if (!useManual) setFile(null);
                  }}
                  className="text-sm text-blue-600 hover:underline font-semibold"
                >
                  {useManual ? '← Use File Upload' : 'Or enter components manually →'}
                </button>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: INPUT / RESULTS */}
          <div className="lg:col-span-2 space-y-6">
            {/* MANUAL INPUT OR VALIDATION BUTTON */}
            {useManual ? (
              <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📝 Component List</h2>
                <textarea
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder={EXAMPLE_BOM}
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter component data in JSON format (one per line or as array)
                </p>
              </div>
            ) : null}

            {/* ACTION BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={handleValidate}
                disabled={loading || (!file && !useManual)}
                className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? '⏳ Validating...' : '✓ Validate Circuit'}
              </button>
              <button
                onClick={handleLoadExample}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Example
              </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-semibold text-red-900">❌ Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            )}

            {/* VALIDATION RESULTS */}
            {validationResult && (
              <div className="space-y-4">
                {/* SAFETY SCORE CARD */}
                <div className={`rounded-lg border p-6 ${getSafetyBadge(getResultScore(validationResult))}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Safety Score</p>
                      <p className="text-3xl font-bold mt-1">{getResultScore(validationResult)}/100</p>
                    </div>
                    <div className="text-5xl">
                      {getResultScore(validationResult) >= 80 ? 'OK' :
                       getResultScore(validationResult) >= 50 ? '!' :
                       getResultScore(validationResult) >= 20 ? '!!' : 'X'}
                    </div>
                  </div>
                </div>

                {/* STATUS SUMMARY */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900">
                    {validationResult.success
                      ? '✓ Circuit Validation Complete'
                      : '❌ Circuit Has Critical Issues'}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {validationResult.diagnostics
                      ? `${validationResult.diagnostics.knownComponentCount} known components checked across ${validationResult.diagnostics.connectionCount} declared connections.`
                      : validationResult.summary}
                  </p>
                </div>

                {/* NEW VALIDATOR WARNINGS */}
                {validationResult.warnings && validationResult.warnings.length > 0 && (
                  <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                    <p className="font-bold text-red-900 mb-3">
                      Diagnostics ({validationResult.warnings.length})
                    </p>
                    <ul className="space-y-3">
                      {validationResult.warnings.map((warning, idx) => (
                        <li key={idx} className="text-sm text-red-800">
                          <p className="font-semibold">
                            {warning.code}: {warning.componentName}
                          </p>
                          <p>{warning.message}</p>
                          <p className="mt-1 text-red-700">Fix: {warning.mitigation}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* LEGACY VIOLATIONS */}
                {validationResult.violations && (
                  <>
                    {/* CRITICAL VIOLATIONS */}
                    {validationResult.violations.critical && validationResult.violations.critical.length > 0 && (
                      <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                        <p className="font-bold text-red-900 mb-3">🚫 Critical Issues ({validationResult.violations.critical.length})</p>
                        <ul className="space-y-2">
                          {validationResult.violations.critical.map((v, idx) => (
                            <li key={idx} className="text-sm text-red-800 flex gap-2">
                              <span>•</span>
                              <span>{v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* WARNING VIOLATIONS */}
                    {validationResult.violations.warning && validationResult.violations.warning.length > 0 && (
                      <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
                        <p className="font-bold text-yellow-900 mb-3">⚠️ Warnings ({validationResult.violations.warning.length})</p>
                        <ul className="space-y-2">
                          {validationResult.violations.warning.map((v, idx) => (
                            <li key={idx} className="text-sm text-yellow-800 flex gap-2">
                              <span>•</span>
                              <span>{v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* INFO VIOLATIONS */}
                    {validationResult.violations.info && validationResult.violations.info.length > 0 && (
                      <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                        <p className="font-bold text-blue-900 mb-3">ℹ️ Information ({validationResult.violations.info.length})</p>
                        <ul className="space-y-2">
                          {validationResult.violations.info.map((v, idx) => (
                            <li key={idx} className="text-sm text-blue-800 flex gap-2">
                              <span>•</span>
                              <span>{v}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {/* RECOMMENDATIONS */}
                {validationResult.recommendations && validationResult.recommendations.length > 0 && (
                  <div className="bg-green-50 rounded-lg border border-green-200 p-4">
                    <p className="font-bold text-green-900 mb-3">💡 Recommendations</p>
                    <ul className="space-y-2">
                      {validationResult.recommendations.map((rec, idx) => (
                        <li key={idx} className="text-sm text-green-800 flex gap-2">
                          <span>→</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ACTION BUTTON */}
                {validationResult.success && (
                  <Link
                    to="/"
                    className="block text-center px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    ✓ Add Items to Cart
                  </Link>
                )}
              </div>
            )}

            {/* EMPTY STATE */}
            {!validationResult && !loading && (
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                <div className="text-5xl mb-4">📊</div>
                <p className="text-gray-600">
                  Upload a BOM file or enter components to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* EDUCATIONAL SECTION */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-blue-900 mb-4">📚 About Circuit Validation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-900">
            <div>
              <p className="font-semibold mb-2">🔌 Voltage Compatibility</p>
              <p>We check if all components operate at compatible voltage levels. Mixing 3.3V and 5V requires a logic-level converter.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">⚡ Current Limits</p>
              <p>We verify that each device doesn't draw more current than its power source can supply. High-current devices need external power.</p>
            </div>
            <div>
              <p className="font-semibold mb-2">✓ Component Database</p>
              <p>All components are validated against our database of 30+ tested hardware devices with known specifications and safety requirements.</p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>⚡ Lab-Reserve | Professional STEM Hardware Store</p>
        </div>
      </footer>
    </div>
  );
}

export default CircuitValidatorPage;
