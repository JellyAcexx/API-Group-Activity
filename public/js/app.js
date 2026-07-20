/**
 * ----------------------------------------------------
 * PROJECT ENVIRONMENT CONFIGURATION (Requirement 4)
 * ----------------------------------------------------
 */

// API REQUIREMENT
const BASE_URL = "https://api.thecatapi.com/v1";
const API_KEY = "live_3iO8BgUrd0J5JMnv10XjWnC11YRzkx2IOJj18ZQ4XiUgcD055QNwbcm53cODB5fw";

// DOM Element Registry Hooks
const breedSelector = document.getElementById("breed-selector");
const displayContainer = document.getElementById("display-container");
const btnUpvote = document.getElementById("btn-upvote");
const btnDownvote = document.getElementById("btn-downvote");
const voteStatusMsg = document.getElementById("vote-status-msg");
const errorAlert = document.getElementById("error-alert");

// State management tracker variables
let currentImageId = null;

// Standardized Auth Header Configuration Mapping
const REQUEST_HEADERS = {
    "Content-Type": "application/json",
    "x-api-key": API_KEY // Fulfills Requirement 4 header requirements
};


// 1. Initializer: Fetch list of all breeds to populate the dropdown menu
async function initializeBreedDropdown() {
    errorAlert.style.display = "none";
    try {
        const response = await fetch(`${BASE_URL}/breeds`, {
            method: "GET",
            headers: REQUEST_HEADERS
        });

        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        const breeds = await response.json();

        // Manipulate data arrays to append entry elements into HTML DOM (Requirement 5)
        breeds.forEach(breed => {
            const option = document.createElement("option");
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelector.appendChild(option);
        });
    } catch (error) {
        handleApplicationErrors(error, "Failed to load cat breeds list from API cluster.");
    }
}

// 2. Fetch specific image and metadata details when a user picks a breed
async function handleBreedChange(event) {
    const selectedBreedId = event.target.value;
    if (!selectedBreedId) return;

    errorAlert.style.display = "none";
    displayContainer.innerHTML = "<p class='loading'>Fetching breed dossier records...</p>";
    voteStatusMsg.textContent = "";

    try {
        const response = await fetch(`${BASE_URL}/images/search?breed_ids=${selectedBreedId}`, {
            method: "GET",
            headers: REQUEST_HEADERS
        });

        if (!response.ok) throw new Error(`HTTP Fetch Error: ${response.status}`);
        const data = await response.json();

        if (data.length === 0) {
            displayContainer.innerHTML = "<p>No profile data records found for this breed choice.</p>";
            return;
        }

        const catData = data[0]; // Kunin ang unang item sa array response
        const breedInfo = catData.breeds[0]; // Kunin ang breed details nito
        currentImageId = catData.id; // Store globally for POST operation target references

        // Render data elements dynamically to UI layout containers (Requirement 5)
        displayContainer.innerHTML = `
            <div class="cat-profile-card">
                <img src="${catData.url}" alt="${breedInfo.name} Photo" class="cat-display-img" style="max-width:100%; height:auto; border-radius:8px; margin-bottom:15px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                <h3>${breedInfo.name}</h3>
                <p class="description"><strong>Description:</strong> ${breedInfo.description}</p>
                <p class="temperament"><strong>Temperament:</strong> ${breedInfo.temperament}</p>
                <p class="origin"><strong>Origin Country:</strong> ${breedInfo.origin}</p>
            </div>
        `;

        // Enable interaction panels
        btnUpvote.disabled = false;
        btnDownvote.disabled = false;

    } catch (error) {
        handleApplicationErrors(error, "Unable to pull down image logs profile parameters.");
    }
}

/**
 * ----------------------------------------------------
 * REQUIREMENT 4: POST REQUEST (CREATING INTERACTION LOGS)
 * ----------------------------------------------------
 */
async function submitVote(scoreValue) {
    if (!currentImageId) return;

    voteStatusMsg.textContent = "Submitting secure payload data...";
    errorAlert.style.display = "none";

    const payload = {
        image_id: currentImageId,
        sub_id: "student_classroom_user_01", 
        value: scoreValue // 1 represents upvote, 0 represents downvote
    };

    try {
        const response = await fetch(`${BASE_URL}/votes`, {
            method: "POST", // Executing explicit create transaction operations
            headers: REQUEST_HEADERS,
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`Server write rejection code: ${response.status}`);
        
        voteStatusMsg.innerHTML = `🎉 <strong>Success!</strong> Your transaction vote was saved to the central cloud platform server database.`;
    } catch (error) {
        handleApplicationErrors(error, "The server rejected your voting submission authorization token credentials.");
    }
}

/**
 * ----------------------------------------------------
 * REQUIREMENT 6: EXPLICIT STACK ERROR DISPLAY HANDLER
 * ----------------------------------------------------
 */
function handleApplicationErrors(err, safeHumanMessage) {
    console.error("Developer Diagnostic Execution Log Summary:", err); 
    errorAlert.textContent = `⚠️ Interface Notification Error: ${safeHumanMessage}`;
    errorAlert.style.display = "block";
    voteStatusMsg.textContent = "";
}

// Global Event triggers initialization maps pathways execution entries
breedSelector.addEventListener("change", handleBreedChange);
btnUpvote.addEventListener("click", () => submitVote(1));
btnDownvote.addEventListener("click", () => submitVote(0));
window.addEventListener("DOMContentLoaded", initializeBreedDropdown);
