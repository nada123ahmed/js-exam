
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    let currentSection = 'initial'; 

    // Toggle Sidebar
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });


    

    // Load initial meals
    fetchMeals('');

   
window.showSection = (section) => {
   
    document.querySelectorAll('.container.mt-5').forEach(el => {
        el.style.display = 'none';
    });


const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
        if (section === 'contact') {
            sectionElement.style.display = 'flex';
        } else {
            
            sectionElement.style.display = 'block';
        }
        
        currentSection = section;
       
        if (section === 'contact') {
            setTimeout(() => {
                setupContactForm();
                const inputs = document.querySelectorAll('#contactForm input');
                inputs.forEach(input => {
                    input.dispatchEvent(new Event('input'));
                });
            }, 0);
        } else if (section === 'initial') {
            fetchMeals('');
        } else if (section === 'categories') {
            fetchCategories();
        } else if (section === 'area') {
            fetchAreas();
        } else if (section === 'ingredients') {
            fetchIngredients();
        }
    } else {
        console.warn(`Section "${section}-section" not found`);
    }
};
    // Fetch Meals (for initial and search)
    function fetchMeals(query = '') {
        query = query.trim();
        let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`;
        if (query.length === 1) url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${encodeURIComponent(query)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const meals = data.meals ? data.meals.slice(0, 20) : [];
                displayMeals(meals);
            })
            .catch(error => console.error('Fetch error:', error));
    }

    // Display Meals
    function displayMeals(meals, targetDivId = 'meals') {
        let mealsDiv;
        if (currentSection === 'initial') mealsDiv = document.getElementById('meals');
        else if (currentSection === 'search') mealsDiv = document.getElementById('search-meals');
        else if (currentSection === 'category-meals') mealsDiv = document.getElementById('category-meals');
        else mealsDiv = document.getElementById(targetDivId);

        if (!mealsDiv) {
            console.error('Meals div not found for section:', currentSection);
            return;
        }
mealsDiv.innerHTML = ''; 
    let cartoona = ''; 
for (let i = 0; i < meals.length; i++) {
    cartoona+=`<div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="meal-card" onclick="showMealDetails('${meals[i].idMeal}')">
                        <img src="${meals[i].strMealThumb}" alt="${meals[i].strMeal}">
                        <div class="p-3 name-card">
                            <h5>${meals[i].strMeal}</h5>
                        </div>
                    </div>
                </div>`
    
}
mealsDiv.innerHTML=cartoona;
       
    }

    // Search Meals
    window.searchMeals = () => {
        const mealName = document.getElementById('mealName').value;
        const mealLetter = document.getElementById('mealLetter').value;
        if (mealName.trim()) fetchMeals(mealName);
        else if (mealLetter.trim()) fetchMeals(mealLetter);
        else console.warn('Please enter a meal name or letter');
    };

    // Fetch Categories
    async function fetchCategories() {
        try {
            const res = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const categories = data.categories;
            displayCategories(categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    // Display Categories
    function displayCategories(categories) {
        const categoriesDiv = document.getElementById('Categories');
        if (!categoriesDiv) {
            console.error('Categories div not found');
            return;
        }


        var cartoona="";
        for (let i = 0; i < categories.length; i++) {
               const shortDescription = categories[i].strCategoryDescription.substring(0, 150) + '...';
          cartoona+=`  <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <div class="position-relative">
                        <img class="w-100 category-img p-3" src="${categories[i].strCategoryThumb}" alt="${categories[i].strCategory}" onclick="fetchMealsByCategory('${categories[i].strCategory}')">
                        <div class="description-tooltip position-absolute">
                            <p class="text-center">${categories[i].strCategory}</p>
                            <p class="text-center">${shortDescription}</p>
                        </div>
                    </div>
                </div>`
            
        }
        categoriesDiv.innerHTML=cartoona;
        
    }

    // Fetch Meals by Category
    window.fetchMealsByCategory = (category) => {
        currentSection = 'category-meals';
        document.querySelectorAll('.container.mt-5').forEach(el => el.style.display = 'none');
        document.getElementById('category-meals-section').style.display = 'block';
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`)
            .then(response => response.json())
            .then(data => {
                const meals = data.meals ? data.meals.slice(0, 20) : [];
                displayMeals(meals, 'category-meals');
            })
            .catch(error => console.error('Fetch error:', error));
    };

    // Fetch Meal Details
    window.showMealDetails = (mealId) => {
        currentSection = 'meal-details';
        document.querySelectorAll('.container.mt-5').forEach(el => el.style.display = 'none');
        document.getElementById('meal-details-section').style.display = 'block';
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
            .then(response => response.json())
            .then(data => {
                const meal = data.meals ? data.meals[0] : null;
                displayMealDetails(meal);
            })
            .catch(error => console.error('Fetch error:', error));
    };

    // Display Meal Details
    function displayMealDetails(meal) {
        const mealDetailsDiv = document.getElementById('mealDetails');
        if (!meal) {
            mealDetailsDiv.innerHTML = '<p class="text-white">Meal not found</p>';
            return;
        }

        // Extract ingredients
        let ingredients = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            const measure = meal[`strMeasure${i}`];
            if (ingredient && ingredient.trim()) {
                ingredients += `<span class="badge bg-info text-dark me-2 mb-2">${measure} ${ingredient}</span>`;
            }
        }

        // Extract tags
        const tags = meal.strTags ? meal.strTags.split(',').map(tag => `<span class="badge bg-secondary me-1">${tag.trim()}</span>`).join('') : 'No tags';

        mealDetailsDiv.innerHTML = `
            <div class="row">
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="img-fluid">
                </div>
                <div class="col-md-8">
                    <h2>${meal.strMeal}</h2>
                    <p><strong>Area:</strong> ${meal.strArea}</p>
                    <p><strong>Category:</strong> ${meal.strCategory}</p>
                    <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
                    <p><strong>Recipes:</strong></p>
                  <div class="d-flex flex-wrap my-3  ">
                ${ingredients}
            </div>
                    <p><strong>Tags:</strong> ${tags}</p>
                    <p>
                        ${meal.strSource ? `<a href="${meal.strSource}" class="btn btn-primary" target="_blank">Source</a>` : ''}
                        ${meal.strYoutube ? `<a href="${meal.strYoutube}" class="btn btn-danger" target="_blank">YouTube</a>` : ''}
                    </p>
                </div>
            </div>
        `;
    }

    // Fetch Areas
    async function fetchAreas() {
        try {
            const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const areas = data.meals;
            displayAreas(areas);
        } catch (error) {
            console.error('Error fetching areas:', error);
        }
    }

    // Display Areas
    function displayAreas(areas) {
        const areasDiv = document.getElementById('Areas');
        if (!areasDiv) {
            console.error('Areas div not found');
            return;
        }
        areasDiv.innerHTML = '';
        areas.forEach(area => {
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
            col.innerHTML = `
                <div class="area-card text-center p-3" onclick="fetchMealsByArea('${area.strArea}')">
                <i class="fa-solid fa-house-laptop fs-1"></i>

                    <h5>${area.strArea}</h5>
                </div>
            `;
            areasDiv.appendChild(col);
        });
    }

    // Fetch Meals by Area
    window.fetchMealsByArea = (area) => {
        currentSection = 'category-meals';
        document.querySelectorAll('.container.mt-5').forEach(el => el.style.display = 'none');
        document.getElementById('category-meals-section').style.display = 'block';
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(area)}`)
            .then(response => response.json())
            .then(data => {
                const meals = data.meals ? data.meals.slice(0, 20) : [];
                displayMeals(meals, 'category-meals');
            })
            .catch(error => console.error('Fetch error:', error));
    };

    // Fetch Ingredients
    async function fetchIngredients() {
        try {
            const res = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            const ingredients = data.meals.slice(0, 20); // Limit to 20 ingredients
            displayIngredients(ingredients);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    }

    // Display Ingredients
    function displayIngredients(ingredients) {
        const ingredientsDiv = document.getElementById('Ingredients');
        if (!ingredientsDiv) {
            console.error('Ingredients div not found');
            return;
        }
        ingredientsDiv.innerHTML = '';
        ingredients.forEach(ingredient => {
            const shortDescription = ingredient.strDescription ? ingredient.strDescription.substring(0, 150) + '...' : 'No description';
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
            col.innerHTML = `
                <div class="ingredient-card text-center p-3" onclick="fetchMealsByIngredient('${ingredient.strIngredient}')">

                <i class="fa-solid fa-drumstick-bite fs-1"></i>
                    <h5>${ingredient.strIngredient}</h5>
                    <p>${shortDescription}</p>
                </div>
            `;
            ingredientsDiv.appendChild(col);
        });
    }

    // Fetch Meals by Ingredient
    window.fetchMealsByIngredient = (ingredient) => {
        currentSection = 'category-meals';
        document.querySelectorAll('.container.mt-5').forEach(el => el.style.display = 'none');
        document.getElementById('category-meals-section').style.display = 'block';
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingredient)}`)
            .then(response => response.json())
            .then(data => {
                const meals = data.meals ? data.meals.slice(0, 20) : [];
                displayMeals(meals, 'category-meals');
            })
            .catch(error => console.error('Fetch error:', error));
    };

   function setupContactForm() {
  const inputs = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    age: document.getElementById("age"),
    password: document.getElementById("password"),
    repassword: document.getElementById("repassword"),
  };

  const icons = {
    name: { valid: document.getElementById("nameIcon"), invalid: document.getElementById("nameIconInvalid") },
    email: { valid: document.getElementById("emailIcon"), invalid: document.getElementById("emailIconInvalid") },
    phone: { valid: document.getElementById("phoneIcon"), invalid: document.getElementById("phoneIconInvalid") },
    age: { valid: document.getElementById("ageIcon"), invalid: document.getElementById("ageIconInvalid") },
    password: { valid: document.getElementById("passwordIcon"), invalid: document.getElementById("passwordIconInvalid") },
    repassword: { valid: document.getElementById("repasswordIcon"), invalid: document.getElementById("repasswordIconInvalid") },
  };

  const errors = {
    name: document.getElementById("nameError"),
    email: document.getElementById("emailError"),
    phone: document.getElementById("phoneError"),
    age: document.getElementById("ageError"),
    password: document.getElementById("passwordError"),
    repassword: document.getElementById("repasswordError"),
  };

  const submitBtn = document.getElementById("submitBtn");

  const validators = {
    name: /^[a-zA-Z ]{3,30}$/,
    email: /^[\w.-]+@[a-zA-Z_-]+?\.[a-zA-Z]{2,3}$/,
    phone: /^01[0125][0-9]{8}$/,
    age: /^([1-9][0-9]?)$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
  };

  function validateInput(key) {
    const value = inputs[key].value.trim();
    let valid = false;

    if (key === "repassword") {
      valid = value === inputs.password.value && validators.password.test(inputs.password.value);
    } else {
      valid = validators[key].test(value);
    }

    // Toggle icons and error
    if (valid) {
      icons[key].valid.classList.remove("d-none");
      icons[key].invalid.classList.add("d-none");
      errors[key].classList.add("d-none");
    } else {
      icons[key].valid.classList.add("d-none");
      icons[key].invalid.classList.remove("d-none");
      errors[key].classList.remove("d-none");
    }

    return valid;
  }

  function validateAll() {
    const allValid = Object.keys(inputs).every(key => validateInput(key));
    submitBtn.disabled = !allValid;
  }

  Object.keys(inputs).forEach(key => {
    inputs[key].addEventListener("input", () => {
      validateInput(key);
      validateAll();
    });
  });

  document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!submitBtn.disabled) {
      alert("submited");
      console.log("✔ تم التسجيل بنجاح!");
      document.getElementById("contactForm").reset();
      submitBtn.disabled = true;
      Object.keys(icons).forEach(key => {
        icons[key].valid.classList.add("d-none");
        icons[key].invalid.classList.add("d-none");
        errors[key].classList.add("d-none");
      });
    }
  });
} 

 
});












 