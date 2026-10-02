const API_URL = "https://www.themealdb.com/api/json/v1/1/";

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const randomBtn = document.getElementById("random-btn");

const recipeContainer = document.getElementById("recipe-container");
const message = document.getElementById("message");

const modal = document.getElementById("recipe-modal");
const closeModal = document.getElementById("close-modal");
const recipeDetails = document.getElementById("recipe-details");


// Nigerian dishes
const nigerianDishes = [
    "Jollof Rice",
    "Fried Rice",
    "Coconut Rice",
    "Ofada Rice",
    "Egusi Soup",
    "Okra Soup",
    "Afang Soup",
    "Efo Riro",
    "Banga Soup",
    "Pepper Soup",
    "Moi Moi",
    "Akara",
    "Suya",
    "Pounded Yam",
    "Amala",
    "Yam Porridge",
    "Beans Porridge",
    "Nigerian Fried Rice",
    "Nigerian Jollof Rice"
];


// SEARCH
searchForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const searchTerm = searchInput.value.trim().toLowerCase();

    if (searchTerm === "") {
        message.textContent = "Please enter a recipe to search for.";
        recipeContainer.innerHTML = "";
        return;
    }

    searchRecipes(searchTerm);
});


// Search Nigerian dishes
function searchRecipes(searchTerm) {

    recipeContainer.innerHTML = "";
    message.textContent = "";

    const matches = nigerianDishes.filter(function(dish) {

        return dish.toLowerCase().includes(searchTerm);

    });


    if (matches.length === 0) {

        message.textContent =
            "No Nigerian recipe found for that search.";

        return;
    }


    matches.forEach(function(dish) {

        findRecipeFromAPI(dish);

    });

}


// Get recipe from TheMealDB
async function findRecipeFromAPI(dish) {

    /*
        IMPORTANT:
        These two recipes use your LOCAL images.
        We display them directly instead of relying
        on TheMealDB's image.
    */

    if (dish === "Jollof Rice" || dish === "Ofada Rice") {

        displayFallbackRecipe(dish);

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}search.php?s=${encodeURIComponent(dish)}`
        );

        const data = await response.json();


        if (data.meals) {

            displayRecipes(data.meals);

        } else {

            displayFallbackRecipe(dish);

        }

    } catch (error) {

        console.error(error);

        displayFallbackRecipe(dish);

    }

}


// Display recipes from API
function displayRecipes(meals) {

    if (!meals) {
        return;
    }


    meals.forEach(function(meal) {

        const card = document.createElement("div");

        card.classList.add("recipe-card");


        card.innerHTML = `

            <img
                src="${meal.strMealThumb}"
                alt="${meal.strMeal}"
            >

            <div class="recipe-info">

                <h2>${meal.strMeal}</h2>

                <p>
                    ${meal.strCategory || "Nigerian Recipe"}
                </p>

                <button
                    class="view-btn"
                    onclick="getRecipeDetails('${meal.idMeal}')"
                >
                    View Recipe
                </button>

            </div>

        `;


        recipeContainer.appendChild(card);

    });

}


// Display locally stored Nigerian recipes
function displayFallbackRecipe(dish) {

    let image = "";


    // My images
    if (dish === "Jollof Rice") {

        image = "jollof.jfif";

    }


    if (dish === "Ofada Rice") {

        image = "images.jfif";

    }

    if (dish === "Beans porridge") {

        image = "beans.jfif";
    }


    const card = document.createElement("div");

    card.classList.add("recipe-card");


    card.innerHTML = `

        ${
            image
                ? `
                    <img
                        src="${image}"
                        alt="${dish}"
                    >
                `
                : ""
        }


        <div class="recipe-info">

            <h2>${dish}</h2>

            <p>Nigerian Recipe</p>

            <button
                class="view-btn"
                onclick="showBasicRecipe('${dish}')"
            >
                View Recipe
            </button>

        </div>

    `;


    recipeContainer.appendChild(card);

}


// RANDOM RECIPE
randomBtn.addEventListener("click", function() {

    recipeContainer.innerHTML = "";
    message.textContent = "";


    const randomIndex =
        Math.floor(Math.random() * nigerianDishes.length);


    const randomDish =
        nigerianDishes[randomIndex];


    findRecipeFromAPI(randomDish);

});


// Get detailed recipe from TheMealDB
async function getRecipeDetails(id) {

    try {

        const response = await fetch(
            `${API_URL}lookup.php?i=${id}`
        );

        const data = await response.json();


        if (data.meals) {

            showRecipeDetails(data.meals[0]);

        }

    } catch (error) {

        console.error(error);

    }

}


// Show recipe details
function showRecipeDetails(meal) {

    let ingredients = "";


    for (let i = 1; i <= 20; i++) {

        const ingredient =
            meal[`strIngredient${i}`];

        const measure =
            meal[`strMeasure${i}`];


        if (
            ingredient &&
            ingredient.trim() !== ""
        ) {

            ingredients += `
                <li>
                    ${measure || ""} ${ingredient}
                </li>
            `;

        }

    }


    recipeDetails.innerHTML = `

        <h2>${meal.strMeal}</h2>

        <img
            class="modal-image"
            src="${meal.strMealThumb}"
            alt="${meal.strMeal}"
        >

        <h3>Ingredients</h3>

        <ul>
            ${ingredients}
        </ul>

        <h3>Instructions</h3>

        <p>
            ${meal.strInstructions}
        </p>

        ${
            meal.strYoutube
                ? `
                    <a
                        href="${meal.strYoutube}"
                        target="_blank"
                        class="youtube-btn"
                    >
                        Watch on YouTube
                    </a>
                `
                : ""
        }

    `;


    modal.style.display = "block";

}


// Basic Nigerian recipe details
function showBasicRecipe(dish) {

    let ingredients = "";
    let instructions = "";


    if (dish === "Jollof Rice") {

        ingredients = `
            <li>Rice</li>
            <li>Tomatoes</li>
            <li>Tomato paste</li>
            <li>Onions</li>
            <li>Red pepper</li>
            <li>Vegetable oil</li>
            <li>Stock</li>
            <li>Seasoning</li>
            <li>Salt</li>
        `;


        instructions = `
            Blend the tomatoes, peppers and onions.
            Fry the blended mixture with tomato paste
            and seasoning. Add stock and allow it to
            cook. Add the washed rice, cover and cook
            until the rice is soft and the liquid has
            been absorbed.
        `;

    }


    else if (dish === "Ofada Rice") {

        ingredients = `
            <li>Ofada rice</li>
            <li>Palm oil</li>
            <li>Green peppers</li>
            <li>Onions</li>
            <li>Locust beans</li>
            <li>Seasoning</li>
            <li>Salt</li>
        `;


        instructions = `
            Wash and cook the Ofada rice until tender.
            Prepare the pepper sauce by blending and
            frying the peppers, onions and locust beans
            in palm oil. Season to taste and serve with
            the cooked Ofada rice.
        `;

    }


    else if (dish === "Fried Rice") {

        ingredients = `
            <li>Rice</li>
            <li>Carrots</li>
            <li>Green beans</li>
            <li>Sweet corn</li>
            <li>Peas</li>
            <li>Onions</li>
            <li>Vegetable oil</li>
            <li>Seasoning</li>
        `;


        instructions = `
            Cook the rice and set it aside. Stir-fry
            the vegetables with onions and seasoning.
            Add the cooked rice and stir thoroughly.
            Continue cooking for a few minutes before
            serving.
        `;

    }


    else if (dish === "Coconut Rice") {

        ingredients = `
            <li>Rice</li>
            <li>Coconut milk</li>
            <li>Onions</li>
            <li>Seasoning</li>
            <li>Salt</li>
        `;


        instructions = `
            Wash the rice and add coconut milk,
            onions, seasoning and salt. Cook until
            the rice is tender and the liquid has
            been absorbed.
        `;

    }


    else {

        ingredients = `
            <li>Main ingredients for ${dish}</li>
            <li>Seasoning</li>
            <li>Salt</li>
        `;


        instructions = `
            Prepare the ingredients and cook according
            to the traditional method for ${dish}.
        `;

    }


    recipeDetails.innerHTML = `

        <h2>${dish}</h2>

        <h3>Ingredients</h3>

        <ul>
            ${ingredients}
        </ul>

        <h3>Instructions</h3>

        <p>
            ${instructions}
        </p>

    `;


    modal.style.display = "block";

}


// Close modal
closeModal.addEventListener("click", function() {

    modal.style.display = "none";

});


// Close modal when clicking outside it
window.addEventListener("click", function(event) {

    if (event.target === modal) {

        modal.style.display = "none";

    }

});