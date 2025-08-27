<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Car Management Server - Dashboard</title>
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .header {
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
        }
        
        .header h1 {
            font-size: 3.5rem;
            font-weight: 800;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 0 4px 20px rgba(0,0,0,0.3);
            animation: slideInDown 1s ease-out;
        }
        
        .header p {
            font-size: 1.2rem;
            color: rgba(255,255,255,0.9);
            font-weight: 300;
            animation: slideInUp 1s ease-out 0.3s both;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            background: #10b981;
            border-radius: 50%;
            margin-right: 8px;
            animation: pulse 2s infinite;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        
        .card {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
        }
        
        .card:hover {
            transform: translateY(-10px);
            box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }
        
        .card-header {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .card-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            font-size: 1.5rem;
            color: white;
        }
        
        .card-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1f2937;
        }
        
        .card-content {
            color: #6b7280;
            line-height: 1.6;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .stat-item {
            text-align: center;
            padding: 1rem;
            background: rgba(102, 126, 234, 0.1);
            border-radius: 12px;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #667eea;
            font-family: 'JetBrains Mono', monospace;
        }
        
        .stat-label {
            font-size: 0.9rem;
            color: #6b7280;
            margin-top: 0.5rem;
        }
        
        .server-info {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(20px);
            border-radius: 20px;
            padding: 2rem;
            margin-bottom: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .server-info h2 {
            font-size: 1.8rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 1.5rem;
            display: flex;
            align-items: center;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        
        .info-item {
            display: flex;
            align-items: center;
            padding: 1rem;
            background: rgba(102, 126, 234, 0.05);
            border-radius: 12px;
            border-left: 4px solid #667eea;
        }
        
        .info-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: #667eea;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            margin-right: 1rem;
        }
        
        .info-content h3 {
            font-size: 0.9rem;
            color: #6b7280;
            margin-bottom: 0.25rem;
        }
        
        .info-content p {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1f2937;
            font-family: 'JetBrains Mono', monospace;
        }
        
        .floating-elements {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        }
        
        .floating-element {
            position: absolute;
            opacity: 0.1;
            animation: float 6s ease-in-out infinite;
        }
        
        .floating-element:nth-child(1) {
            top: 10%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .floating-element:nth-child(2) {
            top: 20%;
            right: 15%;
            animation-delay: 2s;
        }
        
        .floating-element:nth-child(3) {
            bottom: 20%;
            left: 20%;
            animation-delay: 4s;
        }
        
        .floating-element:nth-child(4) {
            bottom: 30%;
            right: 10%;
            animation-delay: 1s;
        }
        
        .floating-element:nth-child(5) {
            top: 50%;
            left: 5%;
            animation-delay: 3s;
        }
        
        .floating-element:nth-child(6) {
            top: 60%;
            right: 5%;
            animation-delay: 5s;
        }
        
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
            }
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: rgba(102, 126, 234, 0.2);
            border-radius: 4px;
            overflow: hidden;
            margin-top: 1rem;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #667eea, #764ba2);
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        
        .action-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        
        .btn-secondary {
            background: rgba(102, 126, 234, 0.1);
            color: #667eea;
            border: 1px solid rgba(102, 126, 234, 0.2);
        }
        
        .btn-secondary:hover {
            background: rgba(102, 126, 234, 0.2);
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2.5rem;
            }
            
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .stats-grid {
                grid-template-columns: 1fr;
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="floating-elements">
        <div class="floating-element">
            <i class="fas fa-car" style="font-size: 3rem; color: white;"></i>
        </div>
        <div class="floating-element">
            <i class="fas fa-cog" style="font-size: 2rem; color: white;"></i>
        </div>
        <div class="floating-element">
            <i class="fas fa-database" style="font-size: 2.5rem; color: white;"></i>
        </div>
        <div class="floating-element">
            <i class="fas fa-server" style="font-size: 2rem; color: white;"></i>
        </div>
        <div class="floating-element">
            <i class="fas fa-network-wired" style="font-size: 2.5rem; color: white;"></i>
        </div>
        <div class="floating-element">
            <i class="fas fa-shield-alt" style="font-size: 2rem; color: white;"></i>
        </div>
    </div>

    <div class="container">
        <div class="header">
            <h1>🚗 Car Management Server</h1>
            <p>
                <span class="status-indicator"></span>
                Server Status: Online | Laravel {{ app()->version() }} | PHP {{ phpversion() }}
            </p>
        </div>

        <div class="server-info">
            <h2><i class="fas fa-server" style="margin-right: 0.5rem; color: #667eea;"></i>Server Information</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-microchip"></i>
                    </div>
                    <div class="info-content">
                        <h3>Server Time</h3>
                        <p>{{ now()->format('Y-m-d H:i:s') }}</p>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-memory"></i>
                    </div>
                    <div class="info-content">
                        <h3>Memory Usage</h3>
                        <p>{{ round(memory_get_usage(true) / 1024 / 1024, 2) }} MB</p>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="info-content">
                        <h3>Uptime</h3>
                        <p>{{ gmdate('H:i:s', time() - $_SERVER['REQUEST_TIME']) }}</p>
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <div class="info-content">
                        <h3>Database</h3>
                        <p>SQLite Connected</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="dashboard-grid">
            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                        <i class="fas fa-users"></i>
                    </div>
                    <div>
                        <div class="card-title">User Management</div>
                    </div>
                </div>
                <div class="card-content">
                    <p>Manage user accounts, permissions, and authentication for the car management system.</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Active Users</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Total Users</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <a href="#" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Add User
                        </a>
                        <a href="#" class="btn btn-secondary">
                            <i class="fas fa-list"></i>
                            View All
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #10b981, #059669);">
                        <i class="fas fa-car"></i>
                    </div>
                    <div>
                        <div class="card-title">Vehicle Management</div>
                    </div>
                </div>
                <div class="card-content">
                    <p>Track and manage vehicle inventory, maintenance schedules, and ownership records.</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Total Vehicles</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Available</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <a href="#" class="btn btn-primary">
                            <i class="fas fa-plus"></i>
                            Add Vehicle
                        </a>
                        <a href="#" class="btn btn-secondary">
                            <i class="fas fa-search"></i>
                            Search
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #f59e0b, #d97706);">
                        <i class="fas fa-tools"></i>
                    </div>
                    <div>
                        <div class="card-title">Maintenance</div>
                    </div>
                </div>
                <div class="card-content">
                    <p>Schedule and track vehicle maintenance, repairs, and service history.</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Pending</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Completed</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <a href="#" class="btn btn-primary">
                            <i class="fas fa-calendar-plus"></i>
                            Schedule
                        </a>
                        <a href="#" class="btn btn-secondary">
                            <i class="fas fa-history"></i>
                            History
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div>
                        <div class="card-title">Analytics</div>
                    </div>
                </div>
                <div class="card-content">
                    <p>View detailed analytics, reports, and insights about your fleet management.</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Reports</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">0</div>
                            <div class="stat-label">Alerts</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <a href="#" class="btn btn-primary">
                            <i class="fas fa-chart-bar"></i>
                            Generate Report
                        </a>
                        <a href="#" class="btn btn-secondary">
                            <i class="fas fa-download"></i>
                            Export
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #8b5cf6, #7c3aed);">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div>
                        <div class="card-title">System Settings</div>
                    </div>
                </div>
                <div class="card-content">
                    <p>Configure system preferences, security settings, and application parameters.</p>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 75%;"></div>
                    </div>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #6b7280;">System Health: 75%</p>
                    <div class="action-buttons">
                        <a href="#" class="btn btn-primary">
                            <i class="fas fa-cog"></i>
                            Configure
                        </a>
                        <a href="#" class="btn btn-secondary">
                            <i class="fas fa-shield-alt"></i>
                            Security
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <div class="card-header">
                    <div class="card-icon" style="background: linear-gradient(135deg, #06b6d4, #0891b2);">
                        <i class="fas fa-route"></i>
                    </div>
                    <div>
                        <div class="card-title">API Status</div>
                    </div>
                </div>
                <div class="card-content">
                    <p>Monitor API endpoints, response times, and service availability.</p>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">100%</div>
                            <div class="stat-label">Uptime</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">0ms</div>
                            <div class="stat-label">Response Time</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <a href="#" class="btn btn-primary">
                            <i class="fas fa-eye"></i>
                            Monitor
                        </a>
                        <a href="#" class="btn btn-secondary">
                            <i class="fas fa-code"></i>
                            API Docs
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Add some interactive functionality
        document.addEventListener('DOMContentLoaded', function() {
            // Animate cards on scroll
            const cards = document.querySelectorAll('.card');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            });

            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'all 0.6s ease';
                observer.observe(card);
            });

            // Update server time
            function updateTime() {
                const timeElement = document.querySelector('.info-content p');
                if (timeElement) {
                    const now = new Date();
                    timeElement.textContent = now.toISOString().slice(0, 19).replace('T', ' ');
                }
            }
            setInterval(updateTime, 1000);

            // Add hover effects to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                });
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        });
    </script>
</body>
</html>
