const generateSVGFromJSON = (data) => {
  const rectWidth = 10;
  const rectHeight = 10;
  const padding = 2;
  const cols = 53; // 53 weeks in a year
  const rows = 7; // 7 days in a week
  const xOffset = 10;
  const yOffset = 20;
  const dayWidth = rectWidth + padding;
  const dayHeight = rectHeight + padding;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const filterYear = 2024;

  const dateKeys = Object.keys(data)
    .map(date => new Date(date))
    .filter(date => date.getFullYear() === filterYear)
    .sort((a, b) => a - b);

  const startDate = new Date(dateKeys[0].getFullYear(), 0, 2); // start on January 1st
  const endDate = new Date(dateKeys[0].getFullYear(), 11, 32); // end on December 31st

  const result = {};
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    result[dateStr] = data[dateStr] || 0;
  }

  const getColor = (level) => {
    if (level === 0) return "#e1e4e8"; // no contributions (light gray)
    if (level < 5) return "#f4c20d"; // low contributions (light orange)
    if (level < 10) return "#f39c12"; // medium contributions (orange)
    return "#e67e22"; // high contributions (dark orange)
  };

  let rects = '';
  let monthMarkers = [];
  const dates = Object.keys(result);

  const displayedMonths = new Set();

  dates.forEach((date, index) => {
    const weekOfYear = Math.floor(index / rows);
    const dayOfWeek = index % rows;

    const x = xOffset + weekOfYear * dayWidth;
    const y = yOffset + dayOfWeek * dayHeight;
    const level = result[date];
    const color = getColor(level);

    const dateObj = new Date(date);
    const month = dateObj.getMonth();

    if (dayOfWeek === 0 && !displayedMonths.has(month)) {
      monthMarkers.push({ x: x, month: month });
      displayedMonths.add(month);
    }

    rects += `
      <rect width="${rectWidth}" height="${rectHeight}" x="${x}" y="${y}" 
            class="ContributionCalendar-day" data-date="${date}" 
            data-level="${level}" rx="2" ry="2" fill="${color}">
      </rect>`;
  });

  monthMarkers.sort((a, b) => a.x - b.x);

  const lastMonthMarker = monthMarkers[monthMarkers.length - 1] || { x: xOffset };
  const svgWidth = Math.max(
    (cols * dayWidth) + xOffset + 10,
    lastMonthMarker.x + rectWidth + 10
  );

  const svgHeight = rows * dayHeight + yOffset + 10;

  const monthLabels = monthMarkers.map(marker => `
    <text x="${marker.x + rectWidth / 2}" y="${yOffset - 5}" text-anchor="middle" fill="#333" font-size="10">
      ${monthNames[marker.month]}
    </text>
  `).join('');

  return `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" 
         preserveAspectRatio="xMidYMid meet" 
         xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 0)">
        ${rects}
        ${monthLabels}
      </g>
    </svg>`;
};

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type === 'application/json') {
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        showError('');
        const data = JSON.parse(e.target.result);
        console.log('Uploaded JSON data:', data);

        const svgContent = generateSVGFromJSON(data);
        console.log('Generated SVG content:', svgContent);

        const calendarSvgElement = document.getElementById('calendar-svg');
        if (calendarSvgElement) {
          calendarSvgElement.innerHTML = svgContent;
        } else {
          showError('SVG container element not found.');
        }

        const downloadBtn = document.getElementById('download-btn');
        if (downloadBtn) {
          downloadBtn.removeEventListener('click', () => downloadSVG(file, svgContent));
          downloadBtn.addEventListener('click', () => downloadSVG(file, svgContent));
          downloadBtn.style.display = 'inline';
        } else {
          showError('Download button element not found.');
        }
      } catch (error) {
        showError('Error parsing JSON: ' + error.message);
      }
    };
    reader.readAsText(file);
  } else {
    showError('Please upload a valid JSON file.');
  }
}

function downloadSVG(file, svgContent) {
  const filename = file.name.replace(/\.[^/.]+$/, "") || 'calendar';
  const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const a = document.createElement('a');
  a.href = svgUrl;
  a.download = `${filename}.svg`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(svgUrl);
}

function showError(message) {
  const errorMessageDiv = document.getElementById('error-message');
  if (errorMessageDiv) {
      errorMessageDiv.textContent = ''; 
      if (message) {
          errorMessageDiv.textContent = message; 
      }
  } else {
      console.error(message);
  }
}

document.getElementById('file-input').addEventListener('change', handleFileSelect);
