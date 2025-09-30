<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ImageBBService
{
    private $apiKey;
    private $baseUrl = 'https://api.imgbb.com/1/upload';

    public function __construct()
    {
        $this->apiKey = config('services.imagebb.api_key');
    }

    /**
     * Upload image to ImageBB
     *
     * @param string $imagePath Path to the image file
     * @param string $filename Optional filename
     * @return array|null
     */
    public function uploadImage($imagePath, $filename = null)
    {
        if (!$this->apiKey) {
            Log::error('ImageBB API key not configured');
            return null;
        }

        try {
            $response = Http::asMultipart()->post($this->baseUrl, [
                'key' => $this->apiKey,
                'image' => fopen($imagePath, 'r'),
                'name' => $filename ?: basename($imagePath),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if ($data['success']) {
                    return [
                        'success' => true,
                        'url' => $data['data']['url'],
                        'delete_url' => $data['data']['delete_url'] ?? null,
                        'thumb' => $data['data']['thumb']['url'] ?? null,
                    ];
                }
            }

            Log::error('ImageBB upload failed', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('ImageBB upload exception', [
                'error' => $e->getMessage(),
                'file' => $imagePath
            ]);

            return null;
        }
    }

    /**
     * Upload image from base64 string
     *
     * @param string $base64Image Base64 encoded image
     * @param string $filename Optional filename
     * @return array|null
     */
    public function uploadBase64Image($base64Image, $filename = null)
    {
        if (!$this->apiKey) {
            Log::error('ImageBB API key not configured');
            return null;
        }

        try {
            $response = Http::asForm()->post($this->baseUrl, [
                'key' => $this->apiKey,
                'image' => $base64Image,
                'name' => $filename ?: 'image_' . time(),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if ($data['success']) {
                    return [
                        'success' => true,
                        'url' => $data['data']['url'],
                        'delete_url' => $data['data']['delete_url'] ?? null,
                        'thumb' => $data['data']['thumb']['url'] ?? null,
                    ];
                }
            }

            Log::error('ImageBB base64 upload failed', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);

            return null;

        } catch (\Exception $e) {
            Log::error('ImageBB base64 upload exception', [
                'error' => $e->getMessage()
            ]);

            return null;
        }
    }
}
