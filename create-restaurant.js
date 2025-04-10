const createRes = () => {
    fetch("http://localhost:3000/restaurants", {
        method: "POST", // Specify the request method
        headers: {
            "Content-Type": "application/json" // Tell the server you are sending JSON
        },
        body: JSON.stringify({ 
            name: "new_restaurant",
            address: "hslkhdhk" 
        }) // Convert the object to JSON
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => console.log("Success:", data)) // Handle success
    .catch(error => console.error("Error:", error)); // Handle errors
}

createRes()