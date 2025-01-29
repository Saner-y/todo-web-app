import "./CircularProgress.css";

export default function CircularProgress({ percentage, color }) {
    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const viewBoxSize = 70;
    const center = viewBoxSize / 2;
  
    return (
      <div className="circular-progress-container">
        <svg 
          className="circular-progress-svg" 
          viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
          width="100%" 
          height="100%"
        >
          {/* Arka plan dairesi */}
          <circle
            className="circular-progress-background"
            cx={center}
            cy={center}
            r={radius}
          />
          
          {/* İlerleme dairesi */}
          <circle
            className="circular-progress-indicator"
            cx={center}
            cy={center}
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{ stroke: color }}
          />
        </svg>
        
        {/* Metni SVG dışına alıyoruz */}
        <div 
          className="circular-progress-text"
          style={{ color: color }}
        >
          {percentage}%
        </div>
      </div>
    );
  };