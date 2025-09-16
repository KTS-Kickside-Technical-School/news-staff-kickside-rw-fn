import React, { useState, useRef, useEffect } from 'react';
import {
  FaDownload,
  FaSpinner,
  FaTrophy,
  FaQrcode,
  FaInstagram,
} from 'react-icons/fa';
import { calculateStandings } from '../../../../utils/helpers/calculateStandings';

interface Team {
  _id: string;
  name: string;
  logo?: string;
  [key: string]: any;
}

interface StandingsTeam {
  team: string;
  logo?: string;
  P: number;
  W: number;
  D: number;
  L: number;
  GF: number;
  GA: number;
  GD: number;
  Pts: number;
}

interface StandingsTableProps {
  matches: any[];
  allTeams: any;
  season: any;
}


const LeagueStandingsTable: React.FC<StandingsTableProps> = ({
  matches,
  allTeams,
  season,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showQROptions, setShowQROptions] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  let standings: StandingsTeam[] = calculateStandings(matches);

  const teamIdToTeam: Record<string, Team> = {};
  allTeams?.forEach((t: any) => {
    teamIdToTeam[t._id] = t;
  });

  const playedTeams = standings.map((t) => t.team);
  const missingTeams = allTeams
    ?.filter((t: any) => !playedTeams.includes(t?.name))
    .map((t: any) => ({
      team: t.name,
      logo: t.logo,
      P: 0,
      W: 0,
      D: 0,
      L: 0,
      GF: 0,
      GA: 0,
      GD: 0,
      Pts: 0,
    }));

  standings = [...standings, ...(missingTeams || [])];

  standings.sort((a, b) => {
    if (b.Pts !== a.Pts) return b.Pts - a.Pts;
    if (b.GD !== a.GD) return b.GD - a.GD;
    return a.team.localeCompare(b.team);
  });

  // Function to load an image with timeout and fallback
  const loadImageWithFallback = (
    url: string,
    timeout: number = 5000
  ): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';

      const timeoutId = setTimeout(() => {
        resolve(createPlaceholderImage());
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(img);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        resolve(createPlaceholderImage());
      };

      img.src = url;
    });
  };

  const createPlaceholderImage = (): HTMLImageElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 40, 40);
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#1d4ed8');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 40, 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('FC', 20, 20);
    }

    const placeholderImg = new Image();
    placeholderImg.src = canvas.toDataURL();
    return placeholderImg;
  };

  const handleQRAction = (action: 'match-center' | 'shop') => {
    const url =
      action === 'match-center'
        ? 'https://www.kickside.rw/en/match-center'
        : 'https://shop.kickside.rw';

    // In a real implementation, you would generate a proper QR code
    // For demo purposes, we'll just show the URL
    window.open(url, '_blank');
    setShowQROptions(false);
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      if (!canvasRef.current) {
        const canvas = document.createElement('canvas');
        canvasRef.current = canvas;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Instagram-optimized dimensions (1080x1080 square)
      canvas.width = 1080;
      canvas.height = 1080;

      // Modern gradient background
      const bgGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      bgGradient.addColorStop(0, '#f8fafc');
      bgGradient.addColorStop(0.5, '#e2e8f0');
      bgGradient.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add modern decorative elements
      ctx.fillStyle = 'rgba(59, 130, 246, 0.03)';
      for (let i = 0; i < 15; i++) {
        const size = Math.random() * 150 + 75;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Modern header with improved design
      const headerHeight = 160;
      const headerGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        headerHeight
      );
      headerGradient.addColorStop(0, '#1e40af');
      headerGradient.addColorStop(0.5, '#3b82f6');
      headerGradient.addColorStop(1, '#6366f1');

      ctx.fillStyle = headerGradient;
      ctx.fillRect(0, 0, canvas.width, headerHeight);

      // Add modern geometric pattern to header
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < canvas.width; i += 60) {
        for (let j = 0; j < headerHeight; j += 60) {
          ctx.beginPath();
          ctx.moveTo(i + 30, j);
          ctx.lineTo(i + 60, j + 30);
          ctx.lineTo(i + 30, j + 60);
          ctx.lineTo(i, j + 30);
          ctx.closePath();
          ctx.fill();
        }
      }

      // Draw tournament logo with modern styling
      if (season?.tournament?.logo) {
        try {
          const logoImg = await loadImageWithFallback(
            season.tournament.logo,
            3000
          );

          // Modern logo container with shadow effect
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 15;
          ctx.shadowOffsetY = 5;

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(100, 80, 50, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowColor = 'transparent';

          ctx.save();
          ctx.beginPath();
          ctx.arc(100, 80, 45, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(logoImg, 55, 35, 90, 90);
          ctx.restore();
        } catch (error) {
          console.error('Error loading tournament logo:', error);
        }
      }

      // Modern tournament title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 52px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 10;
      ctx.fillText(season?.name || 'League Standings', canvas.width / 2, 70);

      // Season year with modern styling
      if (season?.year) {
        ctx.font = '28px "Segoe UI", system-ui, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillText(season.year.name || '2024', canvas.width / 2, 105);
      }

      ctx.shadowColor = 'transparent';

      // Modern date display
      const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      ctx.font = '20px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.fillText(currentDate, canvas.width - 40, 40);

      // Table with modern design
      const tableTop = 200;
      const rowHeight = 50;
      const maxTeams = Math.min(standings.length, 12);

      // Table container with shadow
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 10;
      ctx.fillRect(
        40,
        tableTop - 10,
        canvas.width - 80,
        (maxTeams + 1) * rowHeight + 20
      );
      ctx.shadowColor = 'transparent';

      // Table header with modern gradient
      const tableHeaderGradient = ctx.createLinearGradient(
        50,
        tableTop,
        50,
        tableTop + rowHeight
      );
      tableHeaderGradient.addColorStop(0, '#374151');
      tableHeaderGradient.addColorStop(1, '#4b5563');
      ctx.fillStyle = tableHeaderGradient;
      ctx.fillRect(50, tableTop, canvas.width - 100, rowHeight);

      // Header text with proper spacing
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Segoe UI", system-ui, sans-serif';

      const headers = [
        'POS',
        'TEAM',
        'P',
        'W',
        'D',
        'L',
        'GF',
        'GA',
        'GD',
        'PTS',
      ];
      const columnWidths = [80, 300, 70, 70, 70, 70, 70, 70, 80, 90];
      let xPos = 50;

      headers.forEach((header, index) => {
        ctx.textAlign = index === 1 ? 'left' : 'center';
        const textX = index === 1 ? xPos + 20 : xPos + columnWidths[index] / 2;
        ctx.fillText(header, textX, tableTop + rowHeight / 2 + 8);
        xPos += columnWidths[index];
      });

      // Team rows with modern styling
      const visibleStandings = standings.slice(0, maxTeams);

      for (let i = 0; i < visibleStandings.length; i++) {
        const team = visibleStandings[i];
        const yPos = tableTop + rowHeight + i * rowHeight;

        // Alternating row colors with modern touch
        ctx.fillStyle = i % 2 === 0 ? '#f8fafc' : '#ffffff';
        ctx.fillRect(50, yPos, canvas.width - 100, rowHeight);

        // Special highlighting for top 3
        if (i < 1) {
          const highlightColors = ['#fbbf24', '#e5e7eb', '#d97706'];
          ctx.fillStyle = highlightColors[i] + '20';
          ctx.fillRect(50, yPos, canvas.width - 100, rowHeight);

          ctx.strokeStyle = highlightColors[i];
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(50, yPos);
          ctx.lineTo(50, yPos + rowHeight);
          ctx.stroke();
        }

        let currentX = 50;

        // Position with trophy for first place
        ctx.textAlign = 'center';
        ctx.fillStyle = i === 0 ? '#f59e0b' : '#374151';
        ctx.font = i < 1 ? 'bold 24px "Segoe UI"' : '22px "Segoe UI"';
        ctx.fillText(
          (i + 1).toString(),
          currentX + 40,
          yPos + rowHeight / 2 + 8
        );
        currentX += columnWidths[0];

        // Team logo and name
        if (team.logo) {
          try {
            const logoImg = await loadImageWithFallback(team.logo, 2000);

            ctx.save();
            ctx.beginPath();
            ctx.arc(currentX + 25, yPos + rowHeight / 2, 18, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(logoImg, currentX + 7, yPos + 7, 36, 36);
            ctx.restore();
          } catch (error) {
            console.error('Error loading team logo:', error);
          }
        }

        ctx.textAlign = 'left';
        ctx.fillStyle = '#1f2937';
        ctx.font = 'bold 20px "Segoe UI", system-ui, sans-serif';
        ctx.fillText(team.team, currentX + 55, yPos + rowHeight / 2 + 8);
        currentX += columnWidths[1];

        // Stats with modern formatting
        const stats = [
          team.P,
          team.W,
          team.D,
          team.L,
          team.GF,
          team.GA,
          team.GD,
          team.Pts,
        ];

        stats.forEach((stat, statIndex) => {
          ctx.textAlign = 'center';
          ctx.fillStyle =
            statIndex === stats.length - 1 ? '#2563eb' : '#374151';
          ctx.font =
            statIndex === stats.length - 1
              ? 'bold 22px "Segoe UI"'
              : '20px "Segoe UI"';

          ctx.fillText(
            stat.toString(),
            currentX + columnWidths[statIndex + 2] / 2,
            yPos + rowHeight / 2 + 8
          );
          currentX += columnWidths[statIndex + 2];
        });
      }

      // Modern footer with QR code
      const footerY = tableTop + (maxTeams + 1) * rowHeight + 80;


      // Modern branding
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('KICKSIDE SPORTS', 50, footerY + 30);

      ctx.fillStyle = '#6b7280';
      ctx.font = '18px "Segoe UI", system-ui, sans-serif';
      ctx.fillText('www.kickside.rw • shop.kickside.rw', 50, footerY + 60);
      ctx.fillText('Follow @kickside_rw for more updates', 50, footerY + 85);

      // Convert to image and download
      const dataUrl = canvas.toDataURL('image/png', 0.9);
      const link = document.createElement('a');
      link.download = `${
        season?.name?.replace(/\s+/g, '_') || 'League'
      }_Standings_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();

      setShowExportOptions(false);
    } catch (error) {
      console.error('Error exporting image:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (!standings.length) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 text-center">
        <div className="text-6xl mb-4">🏆</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Standings Yet
        </h3>
        <p className="text-gray-500">
          Standings will appear here once matches are completed
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {season?.tournament?.logo && (
              <div className="w-16 h-16 bg-white rounded-full p-2 shadow-lg">
                <img
                  src={season.tournament.logo}
                  alt="Tournament"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iMjAiIGZpbGw9IiMzYjgyZjYiLz4KPHRleHQgeD0iMjAiIHk9IjI2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgZm9udC1zaXplPSIxMiIgZm9udC1mYW1pbHk9IkFyaWFsIj5GQzwvdGV4dD4KPC9zdmc+';
                  }}
                />
              </div>
            )}
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {season?.name || 'League Standings'}
              </h1>
              <p className="text-blue-100 text-lg">
                {season?.year?.name || '2024'} • Current Season Rankings
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* QR Code Button */}
            <div className="relative">
              <button
                onClick={() => setShowQROptions(!showQROptions)}
                className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all shadow-lg border border-white/30"
              >
                <FaQrcode className="text-xl" />
                QR Code
              </button>

              {showQROptions && (
                <div className="absolute right-0 top-16 bg-white rounded-xl shadow-2xl p-4 z-20 border border-gray-100 min-w-[220px]">
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Choose Destination
                  </h4>
                  <button
                    onClick={() => handleQRAction('match-center')}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors mb-2"
                  >
                    📊 Match Center
                  </button>
                  <button
                    onClick={() => handleQRAction('shop')}
                    className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    🛒 Kickside Shop
                  </button>
                </div>
              )}
            </div>

            {/* Export Button */}
            <div className="relative">
              <button
                onClick={() => setShowExportOptions(!showExportOptions)}
                className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <FaInstagram className="text-xl" />
                Share
              </button>

              {showExportOptions && (
                <div className="absolute right-0 top-16 bg-white rounded-xl shadow-2xl p-4 z-10 border border-gray-100 min-w-[250px]">
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-lg transition-all mb-2"
                  >
                    {isExporting ? (
                      <FaSpinner className="animate-spin text-blue-500" />
                    ) : (
                      <FaDownload className="text-blue-500" />
                    )}
                    Export for Instagram
                  </button>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                    📋 Copy Link
                  </button>
                  <button className="w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors">
                    📱 Share on Social
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <th className="px-6 py-4 text-left font-bold text-sm tracking-wider">
                  POS
                </th>
                <th className="px-6 py-4 text-left font-bold text-sm tracking-wider">
                  TEAM
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  P
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  W
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  D
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  L
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  GF
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  GA
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  GD
                </th>
                <th className="px-4 py-4 text-center font-bold text-sm tracking-wider">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((team: any, idx) => (
                <tr
                  key={idx}
                  className={`
                    ${idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}
                    ${
                      idx < 1
                        ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400'
                        : ''
                    }
                    hover:bg-blue-50/50 transition-all duration-200
                  `}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {idx < 1 && (
                        <FaTrophy
                          className={`text-lg 
                            text-amber-600
                           
                          `}
                        />
                      )}
                      <span
                        className={`font-bold text-lg ${
                          idx < 1 ? 'text-gray-800' : 'text-gray-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-1 shadow-md">
                        {team.logo ? (
                          <img
                            src={team.logo}
                            alt={team.team}
                            className="w-full h-full object-contain rounded-full bg-white"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">${team.team
                                  .substring(0, 2)
                                  .toUpperCase()}</div>`;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {team.team.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-800 text-lg">
                          {team.team}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">
                    {team.P}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-green-600">
                    {team.W}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-yellow-600">
                    {team.D}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-red-600">
                    {team.L}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">
                    {team.GF}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">
                    {team.GA}
                  </td>
                  <td className="px-4 py-4 text-center font-medium text-gray-700">
                    <span
                      className={
                        team.GD >= 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {team.GD > 0 ? '+' : ''}
                      {team.GD}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-xl text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {team.Pts}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modern Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Powered by</span>
              <span className="font-bold text-blue-600">KICKSIDE SPORTS</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-500">
              <span>www.kickside.rw</span>
              <span>•</span>
              <span>shop.kickside.rw</span>
              <span>•</span>
              <span>@kickside_rw</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <h4 className="font-semibold text-gray-800 mb-3">Table Legend</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <span className="font-medium">P:</span> Played
          </div>
          <div>
            <span className="font-medium">W:</span> Won
          </div>
          <div>
            <span className="font-medium">D:</span> Drawn
          </div>
          <div>
            <span className="font-medium">L:</span> Lost
          </div>
          <div>
            <span className="font-medium">GF:</span> Goals For
          </div>
          <div>
            <span className="font-medium">GA:</span> Goals Against
          </div>
          <div>
            <span className="font-medium">GD:</span> Goal Difference
          </div>
          <div>
            <span className="font-medium">Pts:</span> Points
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <FaTrophy className="text-yellow-500" />
            <span>Champion Position</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-2 bg-gradient-to-r from-yellow-200 to-amber-200 rounded"></div>
            <span>Top 3 Positions</span>
          </div>
        </div>
      </div>

      {/* Hidden canvas for export */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};

export default LeagueStandingsTable;
