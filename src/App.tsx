import React, { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { Upload, Type, Image as ImageIcon, Trash2, Sliders, AlignLeft, AlignRight } from 'lucide-react';

interface Config {
    companyName: string;
    email: string;
    phone: string;
    website: string;
    headerOpacity: number;
    headerColor: string;
    textColor: string;
    headerHeightPercent: number;
    logoSize: number;
    logoPosition: 'left' | 'right';
}

const App: React.FC = () => {
    const [mainImage, setMainImage] = useState<HTMLImageElement | null>(null);
    const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
    const [config, setConfig] = useState<Config>({
        companyName: 'ALZ TRUST LIMITED',
        email: 'alztrustnig@gmail.com',
        phone: '+2348033083451',
        website: 'alz-trust.com.ng',
        headerOpacity: 0.85,
        headerColor: '#0f172a', // Deep slate/navy
        textColor: '#ffffff',
        headerHeightPercent: 12,
        logoSize: 60, // % of header height
        logoPosition: 'left', // 'left' or 'right'
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const logoInputRef = useRef<HTMLInputElement>(null);

    const handleMainImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => setMainImage(img);
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => setLogoImage(img);
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => {
        drawCanvas();
    }, [mainImage, logoImage, config]);

    const drawCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas || !mainImage) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions to match original image for max quality
        canvas.width = mainImage.width;
        canvas.height = mainImage.height;

        // 1. Draw Original Image (Preserves faces/quality)
        ctx.drawImage(mainImage, 0, 0);

        // 2. Draw Header (Edge to Edge)
        const headerHeight = (canvas.height * config.headerHeightPercent) / 100;

        const hexToRgb = (hex: string) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (!result) return { r: 15, g: 23, b: 42 };

            const r = result[1];
            const g = result[2];
            const b = result[3];

            if (r === undefined || g === undefined || b === undefined) {
                return { r: 15, g: 23, b: 42 };
            }

            return {
                r: parseInt(r, 16),
                g: parseInt(g, 16),
                b: parseInt(b, 16)
            };
        };

        const rgb = hexToRgb(config.headerColor);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${config.headerOpacity})`;
        ctx.fillRect(0, 0, canvas.width, headerHeight);

        // 3. Draw Elements
        const padding = canvas.width * 0.04;
        let leftOffset = padding;
        let rightOffset = canvas.width - padding;

        // Draw Logo if available
        if (logoImage) {
            const logoHeight = (headerHeight * config.logoSize) / 100;
            const aspectRatio = logoImage.width / logoImage.height;
            const logoWidth = logoHeight * aspectRatio;
            const logoY = (headerHeight - logoHeight) / 2;

            if (config.logoPosition === 'left') {
                ctx.drawImage(logoImage, padding, logoY, logoWidth, logoHeight);
                leftOffset = padding + logoWidth + (padding * 0.4);
            } else {
                ctx.drawImage(logoImage, canvas.width - padding - logoWidth, logoY, logoWidth, logoHeight);
                rightOffset = canvas.width - padding - logoWidth - (padding * 0.4);
            }
        }

        // Company Name
        ctx.fillStyle = config.textColor;
        const fontSize = headerHeight * 0.35;
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'left';
        ctx.fillText(config.companyName, leftOffset, headerHeight / 2);

        // Contact Details
        const detailsFontSize = headerHeight * 0.15;
        ctx.font = `${detailsFontSize}px sans-serif`;
        ctx.textAlign = 'right';

        const lineHeight = detailsFontSize * 1.4;
        const startY = (headerHeight - (lineHeight * 2)) / 2 + (lineHeight / 2);

        ctx.fillText(config.email, rightOffset, startY);
        ctx.fillText(config.phone, rightOffset, startY + lineHeight);
        ctx.fillText(config.website, rightOffset, startY + (lineHeight * 2));

        ctx.textAlign = 'left';
    };

    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `ALZ_Branded_Photo.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    };

    return (
        <div className="min-h-screen bg-slate-100 p-4 md:p-8 font-sans text-slate-900">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Controls Panel */}
                <div className="lg:col-span-1 space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-y-auto max-h-[90vh]">
                    <div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">ALZ BRAND TOOL</h1>
                        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-bold">Pro Photo Branding</p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all font-semibold"
                        >
                            <ImageIcon size={18} />
                            Upload Photo
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleMainImageUpload} className="hidden" accept="image/*" />

                        <div className="flex gap-2">
                            <button
                                onClick={() => logoInputRef.current?.click()}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl transition-all font-semibold border border-slate-200 text-sm"
                            >
                                <Upload size={16} />
                                {logoImage ? 'Change Logo' : 'Add Logo'}
                            </button>
                            {logoImage && (
                                <button
                                    onClick={() => setLogoImage(null)}
                                    className="px-3 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                        <input type="file" ref={logoInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
                    </div>

                    {logoImage && (
                        <div className="space-y-4 border-t border-slate-100 pt-4">
                            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-600"><ImageIcon size={14} /> Logo Settings</h3>
                            <div className="flex bg-slate-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setConfig({ ...config, logoPosition: 'left' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${config.logoPosition === 'left' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                >
                                    <AlignLeft size={14} /> Left
                                </button>
                                <button
                                    onClick={() => setConfig({ ...config, logoPosition: 'right' })}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-xs font-bold transition-all ${config.logoPosition === 'right' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                >
                                    <AlignRight size={14} /> Right
                                </button>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Logo Scale</label>
                                <input
                                    type="range" min="20" max="90"
                                    value={config.logoSize}
                                    onChange={e => setConfig({ ...config, logoSize: parseInt(e.target.value) })}
                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-4 border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-600"><Type size={14} /> Text Content</h3>
                        <div className="space-y-2">
                            {(['companyName', 'email', 'phone', 'website'] as const).map((key) => (
                                <input
                                    key={key}
                                    className="w-full p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={config[key]}
                                    onChange={e => setConfig({ ...config, [key]: e.target.value })}
                                    placeholder={key.replace(/([A-Z])/g, ' $1').trim()}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-bold flex items-center gap-2 text-slate-600"><Sliders size={14} /> Header Styling</h3>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Transparency</label>
                            <input
                                type="range" min="0.1" max="1" step="0.01"
                                value={config.headerOpacity}
                                onChange={e => setConfig({ ...config, headerOpacity: parseFloat(e.target.value) })}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">Bar Height</label>
                            <input
                                type="range" min="5" max="25" step="1"
                                value={config.headerHeightPercent}
                                onChange={e => setConfig({ ...config, headerHeightPercent: parseInt(e.target.value) })}
                                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Bar</label>
                                <input type="color" value={config.headerColor} onChange={e => setConfig({ ...config, headerColor: e.target.value })} className="w-full h-8 rounded border-none cursor-pointer" />
                            </div>
                            <div className="flex-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Text</label>
                                <input type="color" value={config.textColor} onChange={e => setConfig({ ...config, textColor: e.target.value })} className="w-full h-8 rounded border-none cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {mainImage && (
                        <button
                            onClick={downloadImage}
                            className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl transition-all font-bold text-sm shadow-xl"
                        >
                            Download Branded Photo
                        </button>
                    )}
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-3 flex flex-col">
                    <div className="bg-slate-300 rounded-3xl flex-1 flex items-center justify-center overflow-hidden border-8 border-white shadow-2xl relative min-h-[600px]">
                        {!mainImage ? (
                            <div className="text-center p-12">
                                <div className="bg-white/50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    <ImageIcon size={48} className="text-slate-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-700">Waiting for Photo</h2>
                                <p className="text-slate-500 mt-2">Upload your team photo to start branding.</p>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center p-4">
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full max-h-[85vh] shadow-2xl rounded-sm object-contain"
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-slate-400 font-medium">Original image quality is preserved. This tool runs entirely in your browser.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
