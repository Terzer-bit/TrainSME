import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './EnterpriseMetrics.css';
import Menu from '../components/Menu';
import { enterprise } from '../utils/enterprise';
import pfp from '../assets/blank-profile.svg';


function EnterpriseMetrics() {
    const [index, setIndex] = useState(0);
    const data = enterprise[index];


    const barData = [
        { name: "week 1", value: data.week_1 },
        { name: "week 2", value: data.week_2 },
        { name: "week 3", value: data.week_3 },
        { name: "week 4", value: data.week_4 },
    ];

    const handlePrev = () => {
        setIndex((prev) => (prev - 1 + enterprise.length) % enterprise.length);
    };

    const handleNext = () => {
        setIndex((prev) => (prev + 1) % enterprise.length);
    };

    return (
        <div className="dashboard-page">
            <Menu />
            <div className="dashboard-content">
                <div className="dashboard-header">
                    <div className="month-picker">
                        <button onClick={handlePrev} className="picker-button">←</button>
                        <h3 className="picker-month">{data.month}</h3>
                        <button onClick={handleNext} className="picker-button">→</button>
                    </div>
                </div>


                <div className="dashboard-row middle-row">
                    <div className="column-container">
                        <div className="row-container">
                            <div className="top-container top-best">
                                <p className="card-title">Top Best</p>
                                {Object.entries(data.top_best[0]).map(([pos, user]) => (
                                    <div key={pos} className="user-profile-item">
                                        <div className="user-rank">{pos}</div>
                                        <div className="user-avatar-small">
                                            <img src={pfp} alt={`Profile picture for ${user}`} className="avatar-img-small" />
                                        </div>
                                        <div className="username">{user}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="top-container top-worst">
                                <p className="card-title">Top Worst</p>
                                {Object.entries(data.top_worst[0]).map(([pos, user]) => (
                                    <div key={pos} className="user-profile-item">
                                        <div className="user-rank">{pos}</div>
                                        <div className="user-avatar-small">
                                            <img src={pfp} alt={`Profile picture for ${user}`} className="avatar-img-small" />
                                        </div>
                                        <div className="username">{user}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="stats-container">
                            <p className="card-title">Amount of tests done</p>
                            <div className="barchart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={barData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#ddd" vertical={false} />
                                        <XAxis dataKey="name" stroke="#777" axisLine={false} tickLine={false} />
                                        <YAxis stroke="#777" axisLine={false} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd', color: '#333' }}
                                            itemStyle={{ color: '#333' }}
                                            labelStyle={{ color: '#777' }}
                                        />
                                        <Bar dataKey="value" fill="#e74c3c" barSize={30} radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                    </div>


                    <div className="popular-post-card">
                        <p className="card-title">Most Failed Case</p>
                        <img className="most-failed-image" src={data.most_failed} alt="Most failed email" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EnterpriseMetrics;