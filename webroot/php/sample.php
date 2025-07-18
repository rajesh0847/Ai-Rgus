<?php
header('Content-Type: application/json');

// Get the raw POST data
$data = json_decode(file_get_contents("php://input"), true);

// Initialize an empty array to hold the transformed data
$response = [];

// Loop through each item in the received data and transform it
foreach ($data as $index => $item) {
    $dealName = $item['company_name'] . ' ' . $item['location'];

    $response[] = [
        "lineNr" => $index + 1,  // Line number (starts from 1)
        "dealName" => $dealName,
        "statusCode" => 200,  // You can modify this if needed
        "status" => '<div class="alert alert-success fw-bold border-success border-w2 mb-0 py-0">
                        <i class="fas fa-check pe-2"></i>Registered <i>(msg #3838)</i></div>'
    ];
}

// Send the response as JSON
echo json_encode($response);
?>
