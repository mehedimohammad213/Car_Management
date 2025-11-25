<?php

namespace App\Imports;

use App\Models\Car;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnError;
use Maatwebsite\Excel\Concerns\SkipsErrors;
use Maatwebsite\Excel\Concerns\Importable;

class CarsImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnError
{
    use Importable, SkipsErrors;

    private $rowCount = 0;

    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $this->rowCount++;

        // Map Excel columns to database fields
        $carData = [
            'category_id' => $this->getCategoryId($row['category'] ?? null),
            'subcategory_id' => $this->getCategoryId($row['subcategory'] ?? null),
            'ref_no' => $row['ref_no'] ?? null,
            'make' => $row['make'] ?? '',
            'model' => $row['model'] ?? '',
            'model_code' => $row['model_code'] ?? null,
            'variant' => $row['variant'] ?? null,
            'year' => $this->parseYear($row['year'] ?? null),
            'reg_year_month' => $row['reg_year_month'] ?? null,
            'mileage_km' => $this->parseInteger($row['mileage_km'] ?? null),
            'engine_cc' => $this->parseInteger($row['engine_cc'] ?? null),
            'transmission' => $row['transmission'] ?? null,
            'drive' => $row['drive'] ?? null,
            'steering' => $row['steering'] ?? null,
            'fuel' => $row['fuel'] ?? null,
            'color' => $row['color'] ?? null,
            'seats' => $this->parseInteger($row['seats'] ?? null),
            'grade_overall' => $row['grade_overall'] ?? null,
            'grade_exterior' => $row['grade_exterior'] ?? null,
            'grade_interior' => $row['grade_interior'] ?? null,
            'price_amount' => $this->parseDecimal($row['price_amount'] ?? null),
            'price_currency' => $row['price_currency'] ?? 'USD',
            'price_basis' => $row['price_basis'] ?? null,
            'chassis_no_masked' => $row['chassis_no_masked'] ?? null,
            'chassis_no_full' => $row['chassis_no_full'] ?? null,
            'location' => $row['location'] ?? null,
            'country_origin' => $row['country_origin'] ?? null,
            'status' => $row['status'] ?? 'available',
            'notes' => $row['notes'] ?? null,
        ];

        return new Car($carData);
    }

    /**
     * @return array
     */
    public function rules(): array
    {
        return [
            'make' => 'required|string|max:64',
            'model' => 'required|string|max:64',
            'year' => 'required|integer|min:1900|max:' . (date('Y') + 1),
            'category' => 'required|string',
        ];
    }

    /**
     * @return array
     */
    public function customValidationMessages()
    {
        return [
            'make.required' => 'Make is required on row :row',
            'model.required' => 'Model is required on row :row',
            'year.required' => 'Year is required on row :row',
            'year.integer' => 'Year must be a number on row :row',
            'year.min' => 'Year must be at least 1900 on row :row',
            'year.max' => 'Year cannot be in the future on row :row',
            'category.required' => 'Category is required on row :row',
        ];
    }

    /**
     * Get category ID by name
     */
    private function getCategoryId($categoryName)
    {
        if (!$categoryName) {
            return null;
        }

        $category = \App\Models\Category::where('name', 'like', "%{$categoryName}%")->first();
        return $category ? $category->id : null;
    }

    /**
     * Parse year value
     */
    private function parseYear($value)
    {
        if (is_numeric($value)) {
            return (int) $value;
        }

        // Try to extract year from string (e.g., "2020", "2020-01", etc.)
        if (is_string($value)) {
            $year = (int) substr($value, 0, 4);
            if ($year >= 1900 && $year <= (date('Y') + 1)) {
                return $year;
            }
        }

        return date('Y'); // Default to current year
    }

    /**
     * Parse integer value
     */
    private function parseInteger($value)
    {
        if (is_numeric($value)) {
            return (int) $value;
        }

        if (is_string($value)) {
            // Remove non-numeric characters
            $cleanValue = preg_replace('/[^0-9]/', '', $value);
            return $cleanValue ? (int) $cleanValue : null;
        }

        return null;
    }

    /**
     * Parse decimal value
     */
    private function parseDecimal($value)
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        if (is_string($value)) {
            // Remove non-numeric characters except decimal point
            $cleanValue = preg_replace('/[^0-9.]/', '', $value);
            return $cleanValue ? (float) $cleanValue : null;
        }

        return null;
    }

    /**
     * Get the number of rows processed
     */
    public function getRowCount(): int
    {
        return $this->rowCount;
    }
}
