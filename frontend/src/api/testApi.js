import API_URL from "./api";

async function testPackages() {
    try {
        const response = await fetch(`${API_URL}/packages/`);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log("Packages API response:", data);
    } catch (error) {
        console.error("API error:", error);
    }
}

testPackages();
