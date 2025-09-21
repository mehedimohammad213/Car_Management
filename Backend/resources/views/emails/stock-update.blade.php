<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Update Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #3b82f6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #3b82f6;
            margin: 0;
            font-size: 24px;
        }
        .car-info {
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .car-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 10px;
        }
        .car-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 15px 0;
        }
        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .detail-label {
            font-weight: bold;
            color: #6b7280;
        }
        .detail-value {
            color: #111827;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-available { background-color: #dcfce7; color: #166534; }
        .status-sold { background-color: #fecaca; color: #991b1b; }
        .status-reserved { background-color: #fef3c7; color: #92400e; }
        .status-damaged { background-color: #fed7aa; color: #c2410c; }
        .status-lost { background-color: #f3f4f6; color: #374151; }
        .status-stolen { background-color: #fecaca; color: #991b1b; }
        
        .updates-section {
            background-color: #eff6ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .updates-title {
            font-size: 18px;
            font-weight: bold;
            color: #1e40af;
            margin-bottom: 15px;
        }
        .update-item {
            background-color: #ffffff;
            padding: 10px 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 3px solid #3b82f6;
        }
        .update-field {
            font-weight: bold;
            color: #1e40af;
        }
        
        .car-image {
            text-align: center;
            margin: 20px 0;
        }
        .car-image img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background-color: #3b82f6;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin: 20px 0;
        }
        .cta-button:hover {
            background-color: #2563eb;
        }
        
        @media (max-width: 600px) {
            .car-details {
                grid-template-columns: 1fr;
            }
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚗 Stock Update Notification</h1>
            <p>Hello {{ $user->name }}, we have an update on one of our car stocks!</p>
        </div>

        <div class="car-info">
            <div class="car-title">{{ $car->make }} {{ $car->model }} {{ $car->variant ? $car->variant : '' }}</div>
            
            @if($car->photos && count($car->photos) > 0)
                <div class="car-image">
                    <img src="{{ $car->photos[0]->url }}" alt="{{ $car->make }} {{ $car->model }}" style="max-width: 300px;">
                </div>
            @endif

            <div class="car-details">
                <div class="detail-item">
                    <span class="detail-label">Reference Number:</span>
                    <span class="detail-value">{{ $stock->car->ref_no ?? 'N/A' }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Year:</span>
                    <span class="detail-value">{{ $car->year }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Category:</span>
                    <span class="detail-value">{{ $car->category->name ?? 'N/A' }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Quantity:</span>
                    <span class="detail-value">{{ $stock->quantity }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Price:</span>
                    <span class="detail-value">{{ $stock->price ? '$' . number_format($stock->price, 2) : 'Contact for price' }}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">
                        <span class="status-badge status-{{ $stock->status }}">{{ ucfirst($stock->status) }}</span>
                    </span>
                </div>
                @if($car->mileage_km)
                <div class="detail-item">
                    <span class="detail-label">Mileage:</span>
                    <span class="detail-value">{{ number_format($car->mileage_km) }} km</span>
                </div>
                @endif
                @if($car->transmission)
                <div class="detail-item">
                    <span class="detail-label">Transmission:</span>
                    <span class="detail-value">{{ $car->transmission }}</span>
                </div>
                @endif
                @if($car->fuel)
                <div class="detail-item">
                    <span class="detail-label">Fuel Type:</span>
                    <span class="detail-value">{{ $car->fuel }}</span>
                </div>
                @endif
            </div>

            @if($stock->notes)
            <div style="margin-top: 15px;">
                <strong>Notes:</strong>
                <p style="margin: 5px 0; color: #6b7280;">{{ $stock->notes }}</p>
            </div>
            @endif
        </div>

        @if(!empty($updatedFields))
        <div class="updates-section">
            <div class="updates-title">📝 Recent Updates</div>
            @foreach($updatedFields as $field => $value)
                <div class="update-item">
                    <span class="update-field">{{ ucfirst(str_replace('_', ' ', $field)) }}:</span>
                    @if($field === 'status')
                        <span class="status-badge status-{{ $value }}">{{ ucfirst($value) }}</span>
                    @elseif($field === 'price')
                        ${{ number_format($value, 2) }}
                    @else
                        {{ $value }}
                    @endif
                </div>
            @endforeach
        </div>
        @endif

        <div style="text-align: center; margin: 30px 0;">
            <a href="{{ url('/cars/' . $car->id) }}" class="cta-button">View Car Details</a>
        </div>

        <div class="footer">
            <p>This is an automated notification from CarSelling System.</p>
            <p>If you no longer wish to receive these notifications, please contact our support team.</p>
            <p>&copy; {{ date('Y') }} CarSelling. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
