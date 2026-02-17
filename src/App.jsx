import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Instagram, Github, Youtube, MessageSquare, ExternalLink, Sparkles, Circle, Volume2, Volume1, VolumeX, Play, Pause, Code2, Terminal, Cpu, Globe, Zap, MousePointer2, Star, GitFork, Book } from 'lucide-react';

const DISCORD_ID = "1090629202845372477";
const YOUTUBE_VIDEO_ID = "lE_lzhocRl4";
const GITHUB_USERNAME = "ThePasha2015";

const links = [
    { name: 'Instagram', url: 'https://instagram.com/tqxcn', icon: <Instagram size={24} />, color: '#E4405F', desc: '@tqxcn' },
    { name: 'Discord', url: `https://discord.com/users/${DISCORD_ID}`, icon: <MessageSquare size={24} />, color: '#5865F2', desc: 'Discord Hesabım' },
    { name: 'GitHub', url: `https://github.com/${GITHUB_USERNAME}`, icon: <Github size={24} />, color: '#ffffff', desc: 'Projelerim' },
    { name: 'YouTube', url: 'https://youtube.com/@pegraruh', icon: <Youtube size={24} />, color: '#FF0000', desc: 'İçeriklerim' }
];

const skills = [
    { name: 'Python', icon: <Terminal size={18} />, color: '#3776AB' },
    { name: 'JavaScript', icon: <Code2 size={18} />, color: '#F7DF1E' },
    { name: 'Node.js', icon: <Zap size={18} />, color: '#339933' },
    { name: 'HTML', icon: <Globe size={18} />, color: '#E34F26' },
    { name: 'CSS', icon: <Cpu size={18} />, color: '#1572B6' },
    { name: 'C#', icon: <Terminal size={18} />, color: '#239120' },
    { name: 'Lua', icon: <Zap size={18} />, color: '#000080' }
];

const TiltCard = ({ children, className, style }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
    };

    return (
        <motion.div onMouseMove={handleMouseMove} onMouseLeave={() => { x.set(0); y.set(0); }} style={{ rotateY, rotateX, transformStyle: "preserve-3d", ...style }} className={className}>
            <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>{children}</div>
        </motion.div>
    );
};

function App() {
    const [lanyard, setLanyard] = useState(null);
    const [repos, setRepos] = useState([]);
    const [hasEntered, setHasEntered] = useState(false);
    const [isPlaying, setIsPlaying] = useState(true);
    const [volume, setVolume] = useState(50);
    const [isVolumeVisible, setIsVolumeVisible] = useState(false);
    const iframeRef = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const cursorX = useSpring(mouseX, { damping: 20, stiffness: 100 });
    const cursorY = useSpring(mouseY, { damping: 20, stiffness: 100 });

    const sendCommand = (func, args = []) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: func, args: args }), '*');
        }
    };

    useEffect(() => { sendCommand(isPlaying ? 'playVideo' : 'pauseVideo'); }, [isPlaying, hasEntered]);
    useEffect(() => { sendCommand('setVolume', [volume]); }, [volume, hasEntered]);

    useEffect(() => {
        const handleMouseMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Discord Verisi
                const lanyardRes = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
                const lanyardData = await lanyardRes.json();
                if (lanyardData.success) setLanyard(lanyardData.data);

                // GitHub Verisi
                const githubRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
                const githubData = await githubRes.json();
                if (Array.isArray(githubData)) {
                    setRepos(githubData.filter(repo => !repo.fork));
                }
            } catch (err) { console.error(err); }
        };
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'online': return '#22c55e';
            case 'idle': return '#eab308';
            case 'dnd': return '#ef4444';
            default: return '#71717a';
        }
    };

    return (
        <>
            <AnimatePresence>
                {!hasEntered && (
                    <motion.div className="enter-screen" exit={{ opacity: 0, y: -100 }} onClick={() => setHasEntered(true)}>
                        <div className="scanline"></div>
                        <div className="enter-content">
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 10 }}><Sparkles size={40} className="intro-icon" /></motion.div>
                            <motion.h1 className="intro-title" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>PEGRA</motion.h1>
                            <div className="enter-action"><p>GIRIS YAPMAK ICIN DOKUN</p><div className="pulse-circle"><MousePointer2 size={18} /></div></div>
                        </div>
                        <div className="intro-bg-glow"></div>
                    </motion.div>
                )}
            </AnimatePresence>

            {hasEntered && (
                <div style={{ position: 'fixed', top: -1000, left: -1000, pointerEvents: 'none' }}>
                    <iframe ref={iframeRef} width="560" height="315" src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1&autoplay=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}`} title="YouTube player" allow="autoplay"></iframe>
                </div>
            )}

            {hasEntered && (
                <div className="music-control-panel">
                    <AnimatePresence>
                        {isVolumeVisible && (
                            <motion.div className="volume-slider-container" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}>
                                <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(parseInt(e.target.value))} className="volume-slider" />
                                <span className="volume-text">%{volume}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div className="main-controls">
                        <motion.button className="music-btn" onClick={() => setIsVolumeVisible(!isVolumeVisible)}>{volume === 0 ? <VolumeX size={20} /> : volume < 50 ? <Volume1 size={20} /> : <Volume2 size={20} />}</motion.button>
                        <motion.button className="music-btn primary" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause size={20} /> : <Play size={20} />}</motion.button>
                    </div>
                </div>
            )}

            <motion.div className="cursor-glow" style={{ left: cursorX, top: cursorY }} />

            <div className="bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
            </div>

            <main className={`container ${!hasEntered ? 'content-hidden' : ''}`}>
                <motion.section className="profile-section" initial={{ opacity: 0, y: 30 }} animate={hasEntered ? { opacity: 1, y: 0 } : {}}>
                    <div className="avatar-container">
                        {lanyard?.discord_user?.avatar ? (
                            <img src={`https://cdn.discordapp.com/avatars/${DISCORD_ID}/${lanyard.discord_user.avatar}.png?size=256`} alt="Profile" className="avatar" />
                        ) : (
                            <div className="avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(45deg, #8b5cf6, #3b82f6)' }}><Sparkles size={60} color="white" /></div>
                        )}
                        <div className="status-dot" style={{ backgroundColor: getStatusColor(lanyard?.discord_status) }} />
                    </div>
                    <h1 className="name">{lanyard?.discord_user?.global_name || "İbrahim (Pegra)"}</h1>
                    <p className="bio">{lanyard?.activities?.find(a => a.type === 4)?.state || "İbrahim | 21 | Genç Yazılımcı & Bot Developer"}</p>
                </motion.section>

                <motion.section className="skills-section" initial={{ opacity: 0 }} animate={hasEntered ? { opacity: 1 } : {}}>
                    <h2 className="section-title">Kullandığım Teknolojiler</h2>
                    <div className="skills-grid">
                        {skills.map((skill, index) => (
                            <motion.div key={index} className="skill-badge" whileHover={{ scale: 1.1 }} style={{ '--skill-color': skill.color }}>
                                <span className="skill-icon" style={{ color: skill.color }}>{skill.icon}</span>
                                <span className="skill-name">{skill.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* SOSYAL MEDYA KARTLARI */}
                <div className="links-grid">
                    {links.map((link, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <TiltCard className={`link-card ${link.name.toLowerCase()}-card`} style={link.name === 'Discord' ? { background: 'rgba(88, 101, 242, 0.08)', border: '1px solid rgba(88, 101, 242, 0.2)' } : {}}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-card-inner">
                                    <div className="icon-wrapper" style={{ color: link.color }}>{link.icon}</div>
                                    <div className="card-content">
                                        <h3>{link.name}</h3>
                                        <p>{link.name === 'Discord' && lanyard ? lanyard.discord_status.toUpperCase() : link.desc}</p>
                                    </div>
                                    <ExternalLink size={18} className="card-arrow" />
                                </a>
                            </TiltCard>
                        </motion.div>
                    ))}
                </div>

                {/* GITHUB PROJELERI BÖLÜMÜ */}
                {repos.length > 0 && (
                    <motion.section
                        className="projects-section"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="section-title">Öne Çıkan Projelerim</h2>
                        <div className="projects-grid">
                            {repos.map((repo, index) => (
                                <motion.a
                                    key={repo.id}
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="project-card"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="project-header">
                                        <Book size={20} className="project-icon" />
                                        <h3 className="project-name">{repo.name}</h3>
                                    </div>
                                    <p className="project-desc">{repo.description || "Bu proje için bir açıklama girilmemiş."}</p>
                                    <div className="project-meta">
                                        {repo.language && (
                                            <span className="project-lang">
                                                <Circle size={8} fill="var(--accent-primary)" color="transparent" />
                                                {repo.language}
                                            </span>
                                        )}
                                        <span className="project-stars"><Star size={14} /> {repo.stargazers_count}</span>
                                        <span className="project-forks"><GitFork size={14} /> {repo.forks_count}</span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </motion.section>
                )}

                <footer className="footer"><p>© {new Date().getFullYear()} Made by Pegra | Since 2015</p></footer>
            </main>
        </>
    );
}

export default App;
