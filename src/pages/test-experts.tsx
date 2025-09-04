import React, { useState } from 'react';

interface ExpertMatch {
  id: string;
  name: string;
  profession: string;
  email: string;
  shortBio: string;
  profileUrl: string;
  matchScore: number;
  matchedTags: string[];
}

const TestExperts = () => {
  const [loading, setLoading] = useState(false);
  const [expert, setExpert] = useState<ExpertMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    destination: 'Grand Canyon',
    activities: 'Hiking, Photography',
    travelerType: 'Solo',
    experienceLevel: 'Moderate',
    duration: '7 days'
  });

  const presets = {
    hiking: {
      destination: 'Utah National Parks',
      activities: 'Hiking, Photography',
      travelerType: 'Solo',
      experienceLevel: 'Moderate',
      duration: '10 days'
    },
    family: {
      destination: 'Yellowstone',
      activities: 'Wildlife viewing, Easy hikes',
      travelerType: 'Family with kids',
      experienceLevel: 'Beginner',
      duration: '1 week'
    },
    solo: {
      destination: 'Patagonia',
      activities: 'Backpacking, Mountaineering',
      travelerType: 'Solo',
      experienceLevel: 'Extreme',
      duration: '3 weeks'
    },
    luxury: {
      destination: 'Italian Dolomites',
      activities: 'Hiking, Wine tasting',
      travelerType: 'Couple',
      experienceLevel: 'Moderate',
      duration: '2 weeks'
    }
  };

  const loadPreset = (type: keyof typeof presets) => {
    setFormData(presets[type]);
    setExpert(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setExpert(null);

    try {
      const response = await fetch('/api/test-experts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setExpert(data.expert);
      } else {
        setError(data.error || 'Failed to find expert');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{
        color: '#2d5a3d',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        🎯 Expert Matching Tester (Real Data)
      </h1>

      {/* Preset Buttons */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button onClick={() => loadPreset('hiking')} style={presetButtonStyle}>
          🥾 Hiking Trip
        </button>
        <button onClick={() => loadPreset('family')} style={presetButtonStyle}>
          👨‍👩‍👧‍👦 Family Trip
        </button>
        <button onClick={() => loadPreset('solo')} style={presetButtonStyle}>
          🧳 Solo Adventure
        </button>
        <button onClick={() => loadPreset('luxury')} style={presetButtonStyle}>
          💎 Luxury Trip
        </button>
      </div>

      {/* Form */}
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Destination:</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Grand Canyon, Italy, etc."
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Activities:</label>
            <input
              type="text"
              name="activities"
              value={formData.activities}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="Hiking, Photography, Museums"
              required
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Traveler Type:</label>
            <select
              name="travelerType"
              value={formData.travelerType}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="Solo">Solo</option>
              <option value="Couple">Couple</option>
              <option value="Family with kids">Family with kids</option>
              <option value="Friends">Friends</option>
              <option value="Multi-gen family">Multi-gen family</option>
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Experience Level:</label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleInputChange}
              style={inputStyle}
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Moderate">Moderate</option>
              <option value="Advanced">Advanced</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={labelStyle}>Trip Duration:</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              style={inputStyle}
              placeholder="7 days, 2 weeks, etc."
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...testButtonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? '🔍 Finding Expert...' : '🔍 Find Matching Expert'}
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fee',
          color: '#d32f2f',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Expert Result */}
      {expert && (
        <div style={{
          border: '2px solid #2d5a3d',
          borderRadius: '10px',
          padding: '30px',
          background: '#f8fff8',
          boxShadow: '0 4px 15px rgba(45,90,61,0.1)'
        }}>
          <div style={{
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            alignItems: 'flex-start'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#2d5a3d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>
              {expert.name.charAt(0)}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{
                margin: '0 0 5px 0',
                color: '#2d5a3d',
                fontSize: '24px'
              }}>
                {expert.name}
              </h3>
              <p style={{
                color: '#666',
                margin: '0 0 10px 0',
                fontSize: '16px'
              }}>
                {expert.profession}
              </p>
              <span style={{
                background: '#e8f5e8',
                color: '#2d5a3d',
                padding: '6px 12px',
                borderRadius: '15px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {expert.matchScore}% Match
              </span>
            </div>
          </div>

          <div style={{
            margin: '20px 0',
            lineHeight: '1.6',
            color: '#555',
            fontSize: '16px'
          }}>
            {expert.shortBio}
          </div>

          <div style={{
            display: 'flex',
            gap: '8px',
            margin: '20px 0',
            flexWrap: 'wrap'
          }}>
            {expert.matchedTags.map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#e0f2e0',
                  color: '#2d5a3d',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '500'
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
            <a
              href={expert.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#ff6b35',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              📅 Book Consultation
            </a>
            <a
              href={`mailto:${expert.email}?subject=Travel Planning Inquiry`}
              style={{
                background: '#28a745',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              ✉️ Email Expert
            </a>
          </div>
        </div>
      )}

      {/* Status Info */}
      <div style={{
        marginTop: '40px',
        padding: '20px',
        background: '#e8f5e8',
        borderRadius: '8px',
        fontSize: '14px'
      }}>
        <h3 style={{ color: '#2d5a3d', margin: '0 0 10px 0' }}>
          📋 System Status
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>✅ Real Airtable data connection</li>
          <li>✅ Live expert matching algorithm</li>
          <li>✅ 65+ tags from database</li>
          <li>✅ Instant testing environment</li>
        </ul>
        
        <p style={{ margin: '15px 0 0 0', color: '#666' }}>
          <strong>Test URL:</strong> http://localhost:3007/test-experts
        </p>
      </div>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: 'bold',
  color: '#333',
  fontSize: '16px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '2px solid #ddd',
  borderRadius: '6px',
  fontSize: '16px',
  boxSizing: 'border-box'
};

const presetButtonStyle: React.CSSProperties = {
  background: '#6c757d',
  color: 'white',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '500'
};

const testButtonStyle: React.CSSProperties = {
  background: '#2d5a3d',
  color: 'white',
  padding: '16px 32px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '18px',
  fontWeight: '600',
  cursor: 'pointer',
  width: '100%',
  transition: 'all 0.2s'
};

export default TestExperts;