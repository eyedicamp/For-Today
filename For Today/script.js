let weather = {
    apikey: "3d9cf12d9c6a088262c2377c6e1a52c3",
    accessKey: 'E9nU-nIEbmTnCmp_1znppRLYxVkn_NLNtXwd_-qd-Ew',
    temp: 25,
    coldSensitivity: "mid",
    cocktails: [],
    // openweathermap API : 날씨 정보 제공 (AJAX 기능 활용)
    fetchWeather: function(city) {
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apikey}`,
            method: 'GET',
            success: (data) => {
                this.displayWeather(data);
            }
        });
    },

    // 날씨 정보 출력
    displayWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        $(".city").text("Weather in " + name);
        $(".icon").attr("src", `https://openweathermap.org/img/wn/${icon}.png`);
        $(".description").text(description);
        $(".temp").text(temp + "°C");
        $(".humidity").text("Humidity: " + humidity + "%");
        $(".wind").text("Wind speed: " + speed + " km/h");
        this.temp = temp;
        this.displayOutfit();

        // unsplash API : 사용자 입력 도시에 따른 배경 이미지 제공 (AJAX 기능 활용)
        $.ajax({
            url: `https://api.unsplash.com/search/photos?query=${name}&client_id=${this.accessKey}`,
            method: 'GET',
            success: (data) => {
                this.displayBackground(data);
            }
        });
    },

    // 배경화면 출력
    displayBackground: function(data) {
        const images = data.results;
        const randomImage = images[Math.floor(Math.random() * images.length)].urls.full;
        $("body").css("backgroundImage", `url(${randomImage})`);
    },

    displayOutfit: function() {
        // 온도에 맞는 옷차림 저장
        const outfits = {
            30: [
                ['Tank top', 'Shorts', 'Sandals', 'Hat', 'Sunglasses'],
                ['Sleeveless shirt', 'Shorts', 'Flip-flops', 'Cap', 'Sunglasses'],
                ['T-shirt', 'Shorts', 'Sandals', 'Hat', 'Sunglasses'],
                ['Tank top', 'Bermuda shorts', 'Sandals', 'Hat', 'Sunglasses'],
                ['Sleeveless shirt', 'Shorts', 'Sandals', 'Cap', 'Sunglasses']
            ],
            25: [
                ['T-shirt', 'Shorts', 'Flip-flops', 'Cap', 'Sunglasses'],
                ['T-shirt', 'Bermuda shorts', 'Sneakers', 'Hat', 'Sunglasses'],
                ['Polo shirt', 'Shorts', 'Flip-flops', 'Cap', 'Sunglasses'],
                ['T-shirt', 'Shorts', 'Sandals', 'Cap', 'Sunglasses'],
                ['Tank top', 'Shorts', 'Sneakers', 'Hat', 'Sunglasses']
            ],
            20: [
                ['T-shirt', 'Blue Jeans', 'Sneakers', 'Light jacket', 'Hat'],
                ['Polo shirt', 'Black Jeans', 'Sneakers', 'Light jacket', 'Cap'],
                ['T-shirt', 'Cargo pants', 'Sneakers', 'Light jacket', 'Hat'],
                ['Long sleeve shirt', 'Blue Jeans', 'Sneakers', 'Light jacket', 'Cap'],
                ['T-shirt', 'Chinos', 'Sneakers', 'Light jacket', 'Hat']
            ],
            15: [
                ['Sweater', 'Blue Jeans', 'Jacket', 'Boots', 'Cap'],
                ['Hoodie', 'Black Jeans', 'Jacket', 'Sneakers', 'Beanie'],
                ['Sweater', 'Cargo pants', 'Jacket', 'Boots', 'Hat'],
                ['Long sleeve shirt', 'Blue Jeans', 'Jacket', 'Sneakers', 'Cap'],
                ['Sweater', 'Chinos', 'Jacket', 'Boots', 'Beanie']
            ],
            10: [
                ['Heavy sweater', 'Chinos', 'Coat', 'Gloves', 'Beanie'],
                ['Hoodie', 'Blue Jeans', 'Coat', 'Gloves', 'Scarf'],
                ['Heavy sweater', 'Cargo pants', 'Coat', 'Gloves', 'Hat'],
                ['Long sleeve shirt', 'Black Pants', 'Coat', 'Gloves', 'Beanie'],
                ['Heavy sweater', 'Blue Jeans', 'Coat', 'Gloves', 'Scarf']
            ],
            5: [
                ['Parka', 'Thermal pants', 'Gloves', 'Hat', 'Scarf'],
                ['Heavy coat', 'Thermal wear', 'Gloves', 'Hat', 'Scarf'],
                ['Puffer jacket', 'Thermal pants', 'Gloves', 'Hat', 'Scarf'],
                ['Heavy coat', 'Black Jeans', 'Gloves', 'Hat', 'Scarf'],
                ['Parka', 'Thermal pants', 'Boots', 'Hat', 'Scarf']
            ],
            0: [
                ['Heavy coat', 'Thermal wear', 'Boots', 'Scarf', 'Gloves'],
                ['Parka', 'Thermal pants', 'Boots', 'Scarf', 'Gloves'],
                ['Heavy coat', 'Black Jeans', 'Boots', 'Scarf', 'Gloves'],
                ['Puffer jacket', 'Thermal wear', 'Boots', 'Scarf', 'Gloves'],
                ['Heavy coat', 'Thermal pants', 'Boots', 'Scarf', 'Gloves']
            ]
        };

        let temperature = this.temp;

        // 추위 민감도에 따라 온도 변경
        if (this.coldSensitivity === 'low') {
            temperature += 5;
        } else if (this.coldSensitivity === 'high') {
            temperature -= 5;
        }

        let nearestTemp = Object.keys(outfits).reduce((prev, curr) => 
            Math.abs(curr - temperature) < Math.abs(prev - temperature) ? curr : prev
        );

        let selectedOutfits = outfits[nearestTemp];
        let randomOutfit = selectedOutfits[Math.floor(Math.random() * selectedOutfits.length)];

        // 옷차림 list에 추가
        const outfitList = $('#outfitList');
        outfitList.empty();
        randomOutfit.forEach(item => {
            const listItem = $('<li>').text(item);
            outfitList.append(listItem);
        });
    },

    search: function(city, coldSensitivity, alcoholPreferences) {
        this.coldSensitivity = coldSensitivity;
        this.fetchWeather(city);
        this.getCocktails(alcoholPreferences);

        // DOM을 사용해 HTML Element나 CSS Property 5개 이상 바꾸기
        document.querySelector(".navBar").style.display = "block";
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".outfit").style.display = "block";
        document.querySelector(".cocktail").style.display = "block";
        document.querySelector(".search").style.display = "none";
        document.querySelector(".cold_sensitivity").style.display = "none";
        document.querySelector(".alcohol_preferences").style.display = "none";
    },

    // api-ninja cocktail API : 칵테일 이름 제공 (AJAX 기능 활용)
    getCocktails: function(ingredients) {
        const ingredientsString = ingredients.join(',');
        $.ajax({
            url: `https://api.api-ninjas.com/v1/cocktail?ingredients=${ingredientsString}`,
            method: 'GET',
            headers: { 'X-Api-Key': 'bmr37nHVBmibYLJ6b9NfHA==i7iePMPiZdp0furn'},
            success: (result) => {
                result.forEach(cocktail => {
                    this.cocktails.push(cocktail.name)
                });
                this.displayCocktail();
            }
        });
    },

    // 해당 술을 모두 사용하는 칵테일이 없는 경우 예외처리 구현
    displayCocktail: function() {
        if (this.cocktails.length === 0) {
            $('#cocktailName').text("No matching cocktail!");
            return;
        };

        const randomCocktail = this.cocktails[Math.floor(Math.random() * this.cocktails.length)];
        $('#cocktailName').text(randomCocktail);
    }
};

// 입력 format 오류 예외 처리 기능 구현
function validateInput() {
    const city = $('#cityInput').val();
    const alcoholPreferences = Array.from($('input[type="checkbox"]:checked')).map(el => el.name);
    // 정규표현식을 활용하여 영어 입력 예외처리
    const cityRegex = /^[a-zA-Z\s]+$/;

    if (!city) {
        alert("도시 이름을 입력하세요!");
        return false;
    }

    if (!cityRegex.test(city)) {
        alert("도시 이름은 영어로 입력하세요!");
        return false;
    }

    if (alcoholPreferences.length === 0) {
        alert("1개 이상의 술을 선택하세요!");
        return false;
    }

    return true;
}

// Button 클릭 시 input 값들을 받아오도록 구현
$(".search button").on("click", function() {
    if (validateInput()) {
        const city = $('#cityInput').val();
        const coldSensitivity = $('input[name="cold"]:checked').val();
        const alcoholPreferences = Array.from($('input[type="checkbox"]:checked')).map(el => el.name);
        weather.search(city, coldSensitivity, alcoholPreferences);
    }
});

// Button 클릭 뿐 아니라 엔터로도 검색이 가능하도록 구현
$(".searchbar").on("keyup", function(event) {
    if(event.key === "Enter") {
        if (validateInput()) {
            const city = $('#cityInput').val();
            const coldSensitivity = $('input[name="cold"]:checked').val();
            const alcoholPreferences = Array.from($('input[type="checkbox"]:checked')).map(el => el.name);
            weather.search(city, coldSensitivity, alcoholPreferences);
        }
    }
});

// 새로고침 버튼 동작 구현
$("#newCocktail").on("click", function() {
    weather.displayCocktail();
});

$("#newOutfit").on("click", function() {
    weather.displayOutfit();
});
