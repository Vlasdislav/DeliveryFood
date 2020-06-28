
// Константы
const cartButton = document.querySelector("#cart-button"),
      modal = document.querySelector(".modal"),
      close = document.querySelector(".close"), 
      buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      logInForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      cardsRestaurants = document.querySelector('.cards-restaurants'),
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu'),
      buttonLogin = document.querySelector('.button-login'),
      sectionHeadingRestaurants = document.querySelector('.section-heading-restaurants'),
      modalBody = document.querySelector('.modal-body'),
      modalPrice = document.querySelector('.modal-pricetag'),
      buttonClearCart = document.querySelector('.clear-cart');

// Переменные
let login = localStorage.getItem('gloDelivery'); // получение логина по ключу из Application

const cart = [];

  const getData = async (url) => { // Присвоение переменной функцию. async - делает функцию асинхронной
    
    const response = await fetch(url); // В данном случае функция позволяет обратится к бд

    if (!response.ok) 
      throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`) // throw сбрасывает выполнение этой функции и вызывает ошибку; ${} - инторполяция (можно вставить js код)

      return await response.json();
  };

      //console.dir(modalAuth); //Вывод свойст данного класса

// Функционал
      toggleModal = () => {
        modal.classList.toggle("is-open");
      };

      toggleModalAuth = () => {
        modalAuth.classList.toggle('is-open');
      };

      authorized = () => {

        logOut = () => {
          login = '';

          localStorage.removeItem('gloDelivery');

          buttonAuth.style.display = '';
          userName.style.display = '';
          buttonOut.style.display = '';
          cartButton.style.display = '';

          buttonOut.removeEventListener('click', logOut);
          checkAuth();
        }

        console.log("Авторизован");

        userName.textContent = login;

        buttonAuth.style.display = 'none';
        userName.style.display = 'inline';
        buttonOut.style.display = 'flex';
        cartButton.style.display = 'flex';

        buttonOut.addEventListener('click', logOut);
      };

      notAuthorized = () => {
        console.log("Не авторизован");

        logIn = (event) => {
          console.log(event);
          event.preventDefault(); // Отменяет перезагрузку странице
          login = loginInput.value;

          localStorage.setItem('gloDelivery', login) // Запись login в Application 

          toggleModalAuth();
          buttonAuth.removeEventListener('click', toggleModalAuth);
          closeAuth.removeEventListener('click', toggleModalAuth);
          logInForm.removeEventListener('submit', logIn);
          logInForm.reset(); // Сбрасывает значения по умолчанию
          checkAuth();
        }

        buttonAuth.addEventListener('click', toggleModalAuth);
        closeAuth.addEventListener('click', toggleModalAuth);
        logInForm.addEventListener('submit', logIn);
      };

      checkAuth = () => {
        if (login) {
          authorized();
        } else {
          notAuthorized();
        }
      };

      createCardResaurant = (restaurant) => {

        const { // деструктуризация
          image,
          kitchen,
          name,
          price,
          products,
          stars,
          time_of_delivery: timeOfDelivery // создание новой переменной со значением старой
         } = restaurant;

        const card = `
          <a class="card card-restaurant" data-products="${products}">
            <img src="${image}" alt="image" class="card-image"/>
            <div class="card-text">
              <div class="card-heading">
                <h3 class="card-title">${name}</h3>
                <span class="card-tag tag">${timeOfDelivery} мин</span>
              </div>
              <div class="card-info">
                <div class="rating">
                  ${stars}
                </div>
                <div class="price">От ${price} ₽</div>
                <div class="category">${kitchen}</div>
              </div>
            </div>
          </a>
          `;

          cardsRestaurants.insertAdjacentHTML('beforeend', card); // Вставляем карту ресторана в конец insertAdjacentHTML позволяет вставлять html на страницы

      };

      createCardGood = ({ 
        description,
        name,
        price,
        id,
        image
       }) => { // деструктуризация из объекта goods
        const card = document.createElement('div'); // создали div
        card.className = 'card'; // c классом card
        
        card.insertAdjacentHTML('beforeend', `
          <img src="${image}" alt="image" class="card-image"/>
          <div class="card-text">
            <div class="card-heading">
              <h3 class="card-title card-title-reg">${name}</h3>
            </div>
            <div class="card-info">
              <div class="ingredients">${description}
              </div>
            </div>
            <div class="card-buttons">
              <button class="button button-primary button-add-cart" id="${id}">
                <span class="button-card-text">В корзину</span>
                <span class="button-cart-svg"></span>
              </button>
              <strong class="card-price-bold card-price">${price} ₽</strong>
            </div>
          </div>
        `);

        cardsMenu.insertAdjacentElement('beforeend', card);

      };


      openGoods = (event) => { // event - объект события, создается при действии с конкретным элементом
        const target = event.target; // target говорит о самом событии (клик и т.п.) и где оно произошло
        const restaurant = target.closest('.card-restaurant') // closest позволяет подниматься вверх пока не дойдет до нужного селектора иначе выдает null

        if (login) {
        if (restaurant) {
          cardsMenu.textContent = '';
          containerPromo.classList.add('hide');
          restaurants.classList.add('hide');
          menu.classList.remove('hide');
          
          getData(`./db/${restaurant.dataset.products}`).then((data) => { // then() вызывается после выполнения getData (на этом этапе мыполучаем из db массив)
            data.forEach(createCardGood) // функция будет вызванна столько раз сколько элементов в переменной data (6)
          });
        }
        } else modalAuth.classList.add('is-open');
      };

  
// Обработчики событий
      addToCart = (event) => {

        const target = event.target;
        
        const buttonAddToCart = target.closest('.button-add-cart');
        
        if (buttonAddToCart) {
          const card = target.closest('.card'),
                title = card.querySelector('.card-title-reg').textContent,
                cost = Number(card.querySelector('.card-price').textContent.split(' ')[0]),
                id = buttonAddToCart.id,
                
                food = cart.find((item) => {
                  return item.id === id;
                });
                console.log(cost);
                
                if (food)
                  food.count++;
                else 
                  cart.push({ // Добавление в нутрь cart объект...
                    id,
                    title,
                    cost,
                    count: 1
                  });
            
        }
        
      }

      renderCart = () => {
        modalBody.textContent = '';

        cart.forEach(({ id, cost, title, count }) => {
          const itemCart = `
            <div class="food-row">
              <span class="food-name">${title}</span>
              <strong class="food-price">${cost} ₽</strong>
              <div class="food-counter">
                <button class="counter-button counter-minus" data-id="${id}">-</button>
                <span class="counter">${count}</span>
                <button class="counter-button counter-plus" data-id="${id}">+</button>
              </div>
            </div>
          `;

          modalBody.insertAdjacentHTML('afterbegin', itemCart);
        });

        const totalPrice = cart.reduce((result, item) => { // reduce() Акомулирующая функция принимает переменную, которая будет возвращаться из предеыдущего вызова этой функции (вызывается столько раз скольекр элементов)
          return result + (parseFloat(item.cost) * item.count); // parseFloat() считывает число в строке и выдает ее 
        }, 0); // передаем вторым параметром 0 т.к. result не откуда брать значения => оно будет ровняться 0
        modalPrice.textContent = totalPrice + ' ₽';
      }

      changeCount = (event) => {
        const target = event.target;

        if(target.classList.contains('counter-button')) {
          const food = cart.find((item) => {
            return item.id === target.dataset.id;
          });
    
        if(target.classList.contains('counter-minus')) {
          food.count--;
          if (food.count === 0) {
            cart.splice(cart.indexOf(food), 1); // indexOf() определяет индекс массива
          }
        };

        if(target.classList.contains('counter-plus')) food.count++;
        renderCart();
        };
      }

      init = () => {

        getData('./db/partners.json').then((data) => { // then() вызывается после выполнения getData (на этом этапе мыполучаем из db массив)
          data.forEach(createCardResaurant) // функция будет вызванна столько раз сколько элементов в переменной data (6)
        });
  
        buttonAuth.addEventListener('click', () => {
          
        });
  
        cartButton.addEventListener("click", () => {
          renderCart();
          toggleModal();
        });

        buttonClearCart.addEventListener('click', () => {
          cart.length = 0;
          renderCart();
        });

        modalBody.addEventListener('click', changeCount);

        cardsMenu.addEventListener('click', addToCart)

        close.addEventListener("click", toggleModal);
  
        cardsRestaurants.addEventListener('click', openGoods);
  
        buttonOut.addEventListener('click', () => {
          containerPromo.classList.remove('hide');
          restaurants.classList.remove('hide');
          menu.classList.add('hide');
        });
  
        logo.addEventListener('click', () => {
          containerPromo.classList.remove('hide');
          restaurants.classList.remove('hide');
          menu.classList.add('hide');
        })
  
  // Вызов функции
        checkAuth();

      };

      init();