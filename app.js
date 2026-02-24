const { createApp, ref, computed, reactive, watch } = Vue;

createApp({
  setup() {

    // ── GLOBAL STATE ──
    const dark = ref(false);
    const view = ref('auth');
    const activeCat = ref(null);
    const activeSub = ref(null);
    const openCats = reactive({});
    const cart = ref([]);
    const toast = ref('');
    const toastEmoji = ref('🛒');
    const toastKey = ref(0);
    const checkoutStep = ref(1);
    const orderNumber = ref('');
    const userMenuOpen = ref(false);
    const pastOrders = ref([]);
    const mobileDrawerOpen = ref(false);
    const isLoading = ref(false);
    const removedItem = ref(null);
    let undoTimer = null;
    const touched = reactive({});

    // ── AUTH STATE ──
    const currentUser = ref(null);
    const authTab = ref('login');
    const loginErr = ref('');
    const showLoginPw = ref(false);
    const showRegPw = ref(false);
    const loginForm = reactive({ email:'', password:'' });
    const regForm = reactive({ firstName:'', lastName:'', email:'', password:'', confirm:'', agree:false, avatar:'🧑', color:'#2e8b57' });
    const regErrors = reactive({ email:'', confirm:'', general:'' });

    const avatarOptions = [
      { emoji:'🧑', color:'#2e8b57' }, { emoji:'👩', color:'#1a4a3a' },
      { emoji:'👨', color:'#3cb371' }, { emoji:'🧒', color:'#0d6b4e' },
      { emoji:'🦊', color:'#5a8a4a' }, { emoji:'🐼', color:'#2d6a4f' },
      { emoji:'🌿', color:'#40916c' }, { emoji:'🌱', color:'#52b788' },
    ];

    const userDB = ref([
      { id:1, firstName:'Ayesha', lastName:'Patel',      email:'ayesha@example.com', password:'campus123', avatar:'👩', color:'#1a4a3a', orders:4 },
      { id:2, firstName:'Liam',   lastName:'Adams',    email:'liam@example.com',   password:'glow99',    avatar:'🧑', color:'#2e8b57', orders:2 },
      { id:3, firstName:'Zoe',    lastName:'Van Der Berg',email:'zoe@example.com',   password:'zoe2024',   avatar:'🌿', color:'#40916c', orders:7 },
    ]);

    const existingUsers = computed(() => userDB.value);

    // ── AUTH FUNCTIONS ──
    function switchTab(tab) {
      authTab.value = tab;
      loginErr.value = '';
      regErrors.email = ''; regErrors.confirm = ''; regErrors.general = '';
    }

    function fillLogin(user) {
      loginForm.email = user.email;
      loginForm.password = user.password;
      loginErr.value = '';
    }

    async function doLogin() {
      isLoading.value = true;
      await delay(600);
      const u = userDB.value.find(u => u.email === loginForm.email && u.password === loginForm.password);
      isLoading.value = false;
      if (!u) { loginErr.value = 'Email or password is incorrect.'; return; }
      currentUser.value = { ...u };
      view.value = 'shop';
      showToast('Welcome back, ' + u.firstName + '!', '👋');
    }

    const pwStrength = computed(() => {
      const pw = regForm.password;
      if (!pw) return { pct:0, color:'#ccc', label:'' };
      let score = 0;
      if (pw.length >= 6)  score++;
      if (pw.length >= 10) score++;
      if (/[A-Z]/.test(pw)) score++;
      if (/[0-9]/.test(pw)) score++;
      if (/[^A-Za-z0-9]/.test(pw)) score++;
      const map = [
        { pct:10,  color:'#e54444', label:'Very weak'   },
        { pct:30,  color:'#e57a20', label:'Weak'        },
        { pct:55,  color:'#e5c420', label:'Fair'        },
        { pct:80,  color:'#52b788', label:'Strong'      },
        { pct:100, color:'#2e8b57', label:'Very strong' },
      ];
      return map[Math.min(score, map.length - 1)];
    });

    const canRegister = computed(() =>
      regForm.firstName && regForm.lastName && regForm.email &&
      regForm.password.length >= 6 && regForm.agree
    );

    async function doRegister() {
      regErrors.email = ''; regErrors.confirm = ''; regErrors.general = '';
      if (userDB.value.find(u => u.email === regForm.email)) { regErrors.email = 'This email is already registered.'; return; }
      if (regForm.password !== regForm.confirm && regForm.confirm) { regErrors.confirm = 'Passwords do not match.'; return; }
      isLoading.value = true;
      await delay(700);
      isLoading.value = false;
      const newUser = { id:Date.now(), firstName:regForm.firstName, lastName:regForm.lastName, email:regForm.email, password:regForm.password, avatar:regForm.avatar, color:regForm.color, orders:0 };
      userDB.value.push(newUser);
      currentUser.value = { ...newUser };
      view.value = 'shop';
      showToast('Account created! Welcome, ' + newUser.firstName + '!', '🌿');
    }

    function logout() {
      currentUser.value = null;
      cart.value = [];
      userMenuOpen.value = false;
      view.value = 'auth';
      authTab.value = 'login';
      loginForm.email = ''; loginForm.password = '';
    }

    function saveProfile() {
      const idx = userDB.value.findIndex(u => u.id === currentUser.value.id);
      if (idx >= 0) Object.assign(userDB.value[idx], { firstName:currentUser.value.firstName, lastName:currentUser.value.lastName, email:currentUser.value.email });
      showToast('Profile saved!', '✅');
    }

    function handleGlobalClick() { userMenuOpen.value = false; }

    // ── CHECKOUT FORM ──
    const form = reactive({
      firstName:'', lastName:'', email:'', phone:'',
      address:'', city:'', postal:'', province:'',
      paymentMethod:'card', cardNumber:'', cardExpiry:'', cardCvv:'', cardName:''
    });

    watch(() => view.value, (v) => {
      if (v === 'checkout' && currentUser.value) {
        form.firstName = form.firstName || currentUser.value.firstName;
        form.lastName  = form.lastName  || currentUser.value.lastName;
        form.email     = form.email     || currentUser.value.email;
      }
      if (v === 'checkout') Object.keys(touched).forEach(k => delete touched[k]);
    });

    const paymentMethods = [
      { id:'card',    icon:'💳', name:'Credit / Debit Card'  },
      { id:'eft',     icon:'🏦', name:'Bank Transfer (EFT)'  },
      { id:'payfast', icon:'⚡', name:'PayFast'               },
      { id:'cod',     icon:'💵', name:'Cash on Delivery'      },
    ];

    // ── PRODUCT DATA ──
    const categories = [
      {
        id:'stationary', name:'Stationery', icon:'📚',
        desc:'Everything you need for studying, writing, and organizing.',
        subs:[
          { id:'books',      name:'Books & Notebooks', icon:'📓' },
          { id:'pens',       name:'Pens & Markers',    icon:'🖊️' },
          { id:'pencilcase', name:'Pencil Cases',       icon:'🖍️' },
          { id:'organizers', name:'Desk Organizers',    icon:'🗂️' },
        ]
      },
      {
        id:'homeware', name:'Homeware', icon:'🏠',
        desc:'Stylish decor and essentials for dorms, bedrooms & shared spaces.',
        subs:[
          { id:'dorm-decor',  name:'Dorm Decorations',      icon:'🪴' },
          { id:'bedroom',     name:'Bedroom Accessories',   icon:'🛏️' },
          { id:'dorm-access', name:'Dorm Accessories',      icon:'🪣' },
          { id:'electrical',  name:'Electrical Appliances', icon:'💡' },
        ]
      },
      {
        id:'kitchenware', name:'Kitchenware', icon:'🍳',
        desc:'Everything from cutlery to cleaning — your kitchen sorted.',
        subs:[
          { id:'cutlery',       name:'Cutlery & Utensils',  icon:'🍴' },
          { id:'cleaning',      name:'Cleaning Supplies',   icon:'🧹' },
          { id:'pots',          name:'Pots & Pans',         icon:'🥘' },
          { id:'storage',       name:'Food Storage',        icon:'🫙' },
          { id:'cups & plates', name:'Cups & Plates',       icon:'🍽️' },
        ]
      }
    ];

    const allProducts = [
      { id:1,  catId:'stationary',   subId:'books',          subName:'Books & Notebooks',           emoji:'📓',   name:'Pastel Green Notebook set',   image: 'images/book2.jpg',             desc:'A4, 200 pages, ruled, soft-cover.',                              price:199.99,   stock:'in'  },
      { id:2,  catId:'stationary',   subId:'books',          subName:'Books & Notebooks',           emoji:'📔',   name:'Spiral Notebook',             image: 'images/book3.jpg',             desc:'A3,160gsm cartridge paper, 80 sheets.',                          price:89.99,    stock:'low' },
      { id:3,  catId:'stationary',   subId:'books',          subName:'Books & Notebooks',           emoji:'📕',   name:'Campus Spiral Notebook',      image: 'images/book4.jpg',             desc:'A4, 199 pages, ruled, soft-cover.',                              price:69.99,    stock:'in'  },
      { id:4,  catId:'stationary',   subId:'books',          subName:'Books & Notebooks',           emoji:'📕',   name:'Campus Planner Book',         image: 'images/book5.jpg',             desc:'A5, Weekly layout, undated, compact.',                           price:39.99,    stock:'in'  },
      { id:5,  catId:'stationary',   subId:'pens',           subName:'Pens & Markers',              emoji:'🖊️',   name:'Ballpoint Pen Set (10)',      image: 'images/pens12.jpg',            desc:'Smooth-write, 9mm ball-point.',                                  price:49.99,    stock:'in'  },
      { id:6,  catId:'stationary',   subId:'pens',           subName:'Pens & Markers',              emoji:'✒️',   name:'Modern Fountain Pen',         image: 'images/pens11.jpg',            desc:'Black ink, stainless nib.',                                      price:99.99,    stock:'low' },
      { id:7,  catId:'stationary',   subId:'pens',           subName:'Pens & Markers',              emoji:'🖍️',   name:'Highlighter Set (8)',         image: 'images/highlighter.jpg',       desc:'Pastel & bright, felt tip.',                                     price:89.99,    stock:'in'  },
      { id:8,  catId:'stationary',   subId:'pens',           subName:'Pens & Markers',              emoji:'🎨',   name:'Blue Ballpoint Pen Set (4)',  image: 'images/pens5.jpg',             desc:'Ballpoint, oil-based ink.',                                      price:39.99,    stock:'in'  },
      { id:9,  catId:'stationary',   subId:'pens',           subName:'Pens & Markers',              emoji:'🖍️',   name:'Jelly Marker Set (6)',        image: 'images/highlighter2.jpg',      desc:'Jelly Tip highlighters with glitter',                            price:59.99,    stock:'in'  },
      { id:10, catId:'stationary',   subId:'pens',           subName:'Pens & Markers',              emoji:'✏️',   name:'Aesthetic Pen Set (4)',       image: 'images/pens9.jpg',             desc:'Ballpoint, oil-based ink.',                                      price:89.99,    stock:'in'  },
      { id:11, catId:'stationary',   subId:'pencilcase',     subName:'Pencil Cases',                emoji:'🎒',   name:'Canvas Roll Pencil Case',     image: 'images/pencilcase1.jpg',       desc:'Rolling pencil holder, holds up to 100 pens.',                   price:79.99,    stock:'in'  },
      { id:12, catId:'stationary',   subId:'pencilcase',     subName:'Pencil Cases',                emoji:'🎒',   name:'Pencil Case',                 image: 'images/pencilcase2.jpg',       desc:'Plain black polyester pencil case.',                             price:79.99,    stock:'in'  },
      { id:13, catId:'stationary',   subId:'pencilcase',     subName:'Pencil Cases',                emoji:'🗃️',   name:'Pencil Case',                 image: 'images/pencilcase3.jpg',       desc:'Pencil case with multiple pockets.',                             price:89.99,    stock:'out' },
      { id:15, catId:'stationary',   subId:'bags',           subName:'Pens & Markers',              emoji:'🖊️',   name:'Pastel Pens (8)',             image: 'images/pens13.jpg',            desc:'Pastel, vibrant, smooth-write ballpoint pens.',                  price:149.99,   stock:'in'  },
      { id:16, catId:'stationary',   subId:'bags',           subName:'BackPacks',                   emoji:'💼',   name:'Backpack',                    image: 'images/bags1.jpg',             desc:'Plain Black bag, multiple pockets.',                             price:199.99,   stock:'in'  },
      { id:17, catId:'stationary',   subId:'bags',           subName:'BackPacks',                   emoji:'💼',   name:'Slingbag',                    image: 'images/bags2.jpg',             desc:'Black slingbag, fit for books and laptop.',                      price:179.99,   stock:'in'  },
      { id:18, catId:'stationary',   subId:'bags',           subName:'BackPacks',                   emoji:'💼',   name:'Slingbag',                    image: 'images/bags3.jpg',             desc:'Brown slingbag, slim-fit.',                                      price:179.99,   stock:'in'  },
      { id:19, catId:'stationary',   subId:'bags',           subName:'BackPacks',                   emoji:'👜',   name:'Handbag',                     image: 'images/bags5.jpg',             desc:'Plain minimalist slingbag.',                                     price:179.99,   stock:'in'  },
      { id:20, catId:'stationary',   subId:'organizers',     subName:'Desk Organizers',             emoji:'🗂️',   name:'Bamboo Desk Organizer',       image: 'images/organizer.jpg',         desc:'6 compartments and additional draws, eco material.',             price:379.99,   stock:'low' },
      { id:21, catId:'stationary',   subId:'organizers',     subName:'Desk Organizers',             emoji:'📋',   name:'Sticky Note Set (250)',       image: 'images/stickynotes1.jpg',      desc:'5-piece, 50 sheets each, pastel/bright colored sticky notes.',   price:49.99,    stock:'in'  },
      { id:22, catId:'stationary',   subId:'organizers',     subName:'Desk Organizers',             emoji:'📋',   name:'Highlighter Tape',            image: 'images/highlighter-tape.jpg',  desc:'5-piece, Bright colours.',                                       price:39.99,    stock:'in'  },
      { id:23, catId:'stationary',   subId:'organizers',     subName:'Desk Organizers',             emoji:'🗂️',   name:'Calendar',                    image: 'images/calendar.jpg',          desc:'Calendar, Planner',                                              price:219.99,   stock:'low' },
      { id:24, catId:'homeware',     subId:'dorm-decor',     subName:'Dorm Decorations',            emoji:'🖼️',   name:'Black/White Art Poster A2',   image: 'images/poster2.jpg',           desc:'Black/White Art Poster A2.',                                     price:99.99,    stock:'in'  },
      { id:25, catId:'homeware',     subId:'dorm-decor',     subName:'Dorm Decorations',            emoji:'🖼️',   name:'Black/White Art Poster A3',   image: 'images/poster3.jpg',           desc:'Black/White Art Poster A3.',                                     price:69.99,    stock:'in'  },
      { id:26, catId:'homeware',     subId:'dorm-decor',     subName:'Dorm Decorations',            emoji:'🖼️',   name:'Black/White Art Poster A4',   image: 'images/poster4.jpg',           desc:'Black/White Art Poster A4.',                                     price:39.99,    stock:'in'  },
      { id:27, catId:'homeware',     subId:'dorm-decor',     subName:'Dorm Decorations',            emoji:'🌟',   name:'Mini Plants',                 image: 'images/plant1.jpg',            desc:'Cute artificial plants in pastel pots',                          price:89.99,    stock:'low' },
      { id:28, catId:'homeware',     subId:'dorm-decor',     subName:'Dorm Decorations',            emoji:'🪴',   name:'Mini Aloe Plant',             image: 'images/plant2.jpg',            desc:'Mini spikey aftificial plants',                                  price:89.99,    stock:'in'  },
      { id:29, catId:'homeware',     subId:'dorm-decor',     subName:'Dorm Deccorations',           emoji:'🪴',   name:'Desk Plant',                  image: 'images/plant3.jpg',            desc:'Artificial succulent in a clay pot.',                            price:89.99,    stock:'in'  },
      { id:30, catId:'homeware',     subId:'bedroom',        subName:'Bedroom Accessories',         emoji:'🛏️',   name:'Black/Grey Duvet Set',        image: 'images/bedset2.jpg',           desc:'Single bed, 3-piece set.',                                       price:499.99,   stock:'in'  },
      { id:31, catId:'homeware',     subId:'bedroom',        subName:'Bedroom Accessories',         emoji:'🪞',   name:'Adhesive Round Mirror',       image: 'images/mirror2.jpg',           desc:'Circular round mirror with black frame',                         price:159.99,   stock:'in'  },
      { id:32, catId:'homeware',     subId:'bedroom',        subName:'Bedroom Accessories',         emoji:'🧸',   name:'Cushion Cover 2-Pack',        image: 'images/pillow5.jpg',           desc:'45×45cm, plain black print.',                                    price:89.99,    stock:'in'  },
      { id:33, catId:'homeware',     subId:'bedroom',        subName:'Bedroom Accessories',         emoji:'🧸',   name:'Clothing Rack',               image: 'images/clothesrack1.jpg',      desc:'Clothing rack, 3 tiers.',                                        price:449.99,   stock:'in'  },
      { id:34, catId:'homeware',     subId:'bedroom',        subName:'Bedroom Accessories',         emoji:'🧸',   name:'Bubble Block Candle',         image: 'images/candle6.jpg',           desc:'Bubble block candle',                                            price:59.99,    stock:'in'  },
      { id:35, catId:'homeware',     subId:'bedroom',        subName:'Bedroom Accessories',         emoji:'🧸',   name:'Coffee Scented Candle',       image: 'images/candle5.jpg',           desc:'Coffee scented candles',                                         price:59.99,    stock:'in'  },
      { id:36, catId:'homeware',     subId:'bedroom',        subName:'Bedroom Accessories',         emoji:'🧸',   name:'Rose Candles',                image: 'images/candle4.jpg',           desc:'Rose shaped scented candles',                                    price:59.99,    stock:'in'  },
      { id:37, catId:'homeware',     subId:'dorm-access',    subName:'Dorm Accessories',            emoji:'🧺',   name:'Laundry Basket',              image: 'images/laundrybasket.jpg',     desc:'Pop-up, 45L, with handles.',                                     price:129.99,   stock:'in'  },
      { id:38, catId:'homeware',     subId:'dorm-access',    subName:'Dorm Accessories',            emoji:'🪝',   name:'Over-Door Hook Rack (6)',     image: 'images/hooks1.jpg',            desc:'No drilling, 6 hooks.',                                          price:79.99,    stock:'in'  },
      { id:39, catId:'homeware',     subId:'dorm-access',    subName:'Dorm Accessories',            emoji:'🗑️',   name:'Desktop Waste Bin',           image: 'images/minibins.jpg',          desc:'4L, compact, slim design.',                                      price:49.99,    stock:'out' },
      { id:40, catId:'homeware',     subId:'dorm-access',    subName:'Dorm Accessories',            emoji:'🧸',   name:'Hangers',                     image: 'images/hangers.jpg',           desc:'20pc hanger set in various colours',                             price:199.99,   stock:'in'  },
      { id:41, catId:'homeware',     subId:'dorm-access',    subName:'Dorm Accessories',            emoji:'🧸',   name:'Rugs',                        image: 'images/rug1.jpg',              desc:'8-ball design rug',                                              price:189.99,   stock:'in'  },
      { id:42, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🔌',   name:'Phone Stand',                 image: 'images/phone Holder.jpg',      desc:'Stainless Steel Phone Stand',                                    price:179.99,   stock:'in'  },
      { id:43, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'💡',   name:'LED Strip Lights (5m)',       image: 'images/LED.jpg',               desc:'10meters, RGB, remote control, USB powered.',                    price:199.99,   stock:'in'  },
      { id:44, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🔌',   name:'Extension Cords',             image: 'images/extension cords1.jpg',  desc:'10-in1 USB Extension cord.',                                     price:249.99,   stock:'in'  },
      { id:45, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🔌',   name:'Flat Plug Extension Cords',   image: 'images/cables2.jpg',           desc:'10ft, Extension Cord with Multiple Outlets.',                    price:279.99,   stock:'in'  },
      { id:46, cartId:'homeware',    subId:'electrical',     subName:'Electrical Appliances',       emoji:'🔌',   name:'Phone Charging Cables',       image: 'images/cables.jpg',            desc:'Ultra-fast Phone Charging Cables.',                              price:279.99,   stock:'in'  },
      { id:47, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🪭',   name:'Mini Fan — Desktop',          image: 'images/portable fan1.jpg',     desc:'Portable Table Fan, 6.5inch.',                                   price:129.99,   stock:'low' },
      { id:48, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🪭',   name:'Foldable Desk Fan',           image: 'images/fan.jpg',               desc:'1-Piece, Rechargeable, Portable Fan.',                           price:139.99,   stock:'low' },
      { id:49, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'☕',   name:'Travel Kettle 0.8L',          image: 'images/kettle.jpg',            desc:'Compact, auto shut-off, 1500W.',                                 price:299.99,   stock:'in'  },
      { id:50, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🔌',   name:'CellPhone Selfie Stick',      image: 'images/selfie stick.jpg',      desc:'CellPhone Selfie Stick, Tripod',                                 price:149.99,   stock:'in'  },
      { id:51, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🪭',   name:'Portable Electrical Hand Fan',image: 'images/fan2.jpg',              desc:'Travel size hand fan',                                           price:279.99,   stock:'in'  },
      { id:52, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🧸',   name:'Headphones',                  image:'images/headphones1.jpg',        desc:'Wireless Over-Ear Headphones',                                   price:279.99,   stock:'in'  },
      { id:53, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🧸',   name:'Headphones',                  image:'images/headphones2.jpg',        desc:'Wireless Over-Ear Headphones',                                   price:279.99,   stock:'in'  },
      { id:53, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🧸',   name:'Power Tower Strip',           image:'images/strip1.jpg',             desc:'Wireless Over-Ear Headphones',                                   price:279.99,   stock:'in'  },
      { id:54, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🧸',   name:'Flat Power Strip',            image:'images/Power Strip.jpg',        desc:'Wireless Over-Ear Headphones',                                   price:279.99,   stock:'in'  },
      { id:55, catId:'homeware',     subId:'electrical',     subName:'Electrical Appliances',       emoji:'🧸',   name:'Phone Holder',                image:'images/Phone Holder.jpg',       desc:'Wireless Over-Ear Headphones',                                   price:279.99,   stock:'in'  },
      { id:56, catId:'kitchenware',  subId:'pots',           subName:'Electrical Appliances',       emoji:'🫧',   name:'AirFryer',                    image: 'images/airfryer.jpg',          desc:'6L air fryer',                                                   price:499.99,   stock:'in'  },
      { id:57, catId:'kitchenware',  subId:'pots',           subName:'Electrical Appliances',       emoji:'🫧',   name:'Micro-Oven',                  image: 'images/micro-oven.jpg',        desc:'Dual, stove and oven micro-oven',                                price:499.99,   stock:'in'  },
      { id:58, catId:'kitchenware',  subId:'cutlery',        subName:'Cutlery & Utensils',          emoji:'🍴',   name:'12-Piece Utensil Set',        image: 'images/utensils.jpg',          desc:'Stainless steel, dishwasher safe.',                              price:159.99,   stock:'in'  },
      { id:59, catId:'kitchenware',  subId:'cutlery',        subName:'Cutlery & Utensils',          emoji:'🥄',   name:'Silicone Spatula Set (11)',   image: 'images/spatula.jpg',           desc:'Heat-resistant to 260°C.',                                       price:149.99,   stock:'in'  },
      { id:60, catId:'kitchenware',  subId:'cutlery',        subName:'Cutlery & Utensils',          emoji:'🔪',   name:'Chefs Knife Set (5)',         image: 'images/knifes.jpg',            desc:'High-carbon steel, ergonomic grip.',                             price:299.99,   stock:'low' },
      { id:61, catId:'kitchenware',  subId:'cutlery',        subName:'Cutlery & Utensils',          emoji:'🧹',   name:'Wooden Spoon Set (4)',        image: 'images/woodenspoon.jpg',       desc:'Bamboo handle, sisal bristle.',                                  price:109.99,   stock:'in'  },
      { id:62, catId:'kitchenware',  subId:'cleaning',       subName:'Cleaning Supplies',           emoji:'🧽',   name:'Cellulose Sponges (6)',       image: 'images/sponge.jpg',            desc:'Heavy duty, no-scratch.',                                        price:9.99,     stock:'in'  },
      { id:63, catId:'kitcehnware',  subId:'cleaning',       subName:'Cleaning Supplies',           emoji:'🍨',   name:'Broom',                       image: 'images/broom.jpg',             desc:'Stiff-bristle sweep broom, 120cm handle, indoor & outdoor use.', price:69.99,    stock:'low' },
      { id:64, catId:'kitcehnware',  subId:'cleaning',       subName:'Cleaning Supplies',           emoji:'🍨',   name:'Spin Mop',                    image: 'images/spinmop.jpg',           desc:'Spin mop with bucket, microfibre head, 360° rotating wring.',    price:89.99,    stock:'low' },
      { id:65, catId:'kitcehnware',  subId:'cleaning',       subName:'Cleaning Supplies',           emoji:'🍨',   name:'Plunger',                     image: 'images/plunger.jpg',           desc:'Heavy-duty accordion plunger, non-slip grip, universal fit.',    price:49.99,    stock:'low' },
      { id:66, catId:'kitcehnware',  subId:'cleaning',       subName:'Cleaning Supplies',           emoji:'🍨',   name:'ToiletBrush',                 image: 'images/toiletbrush.jpg',       desc:'Slim holder set, silicone bristles, rust-proof steel handle.',   price:59.99,    stock:'low' },
      { id:67, catId:'kitchenware',  subId:'pots',           subName:'Pots & Pans',                 emoji:'🥘',   name:'Non-Stick Frying Pan Set (3)',image: 'images/pans.jpg',              desc:'Granite coating, induction ready.',                              price:449.99,   stock:'in'  },
      { id:68, catId:'kitchenware',  subId:'pots',           subName:'Pots & Pans',                 emoji:'🍲',   name:'Electrict Pot 3L',            image: 'images/electricpot.jpg',       desc:'Silver Electrical Pot, glass lid.',                              price:489.99,   stock:'in'  },
      { id:69, catId:'kitchenware',  subId:'pots',           subName:'Pots & Pans',                 emoji:'🫕',   name:'Casserole Dish 2.5L',         image: 'images/casserole dish.jpg',    desc:'Oven-safe ceramic, w/ lid.',                                     price:179.99,   stock:'low' },
      { id:70, catId:'kitchenware',  subId:'storage',        subName:'Food Storage',                emoji:'🫙',   name:'Glass Jar Set (3)',           image: 'images/jars.jpg',              desc:'Airtight Jars for Sugar, Coffee, Teabags',                       price:199.99,   stock:'in'  },
      { id:71, catId:'kitchenware',  subId:'storage',        subName:'Food Storage',                emoji:'🥡',   name:'Lunchbox Set',                image: 'images/3layer set.jpg',        desc:'2000ml, 3-layer, lunchbox',                                      price:129.99,   stock:'in'  },
      { id:72, catId:'kitchenware',  subId:'storage',        subName:'Food Storage',                emoji:'🍨',   name:'Lunchbox set',                image: 'images/lunchbox.jpg',          desc:'Plain Black, 3-layer Lunchbox',                                  price:149.99,   stock:'in'  },
      { id:73, catId:'kitchenware',  subId:'cups & plates',  subName:'Cups & Plates',               emoji:'🍨',   name:'Coffee Mugs',                 image: 'images/mugs2.jpg',             desc:'350ml ceramic mug, microwave & dishwasher safe, 6 colours.',     price:29.99,    stock:'in'  },
      { id:74, catId:'kitchenware',  subId:'cups & plates',  subName:'Cups & Plates',               emoji:'🍨',   name:'Plates and Bowls Set(4)',     image: 'images/plates2.jpg',           desc:'Matching ceramic set, 4 bowls + 4 plates.',                      price:199.99,   stock:'in'}
    ]; 

    function stockBadge(product) {
      if (product.stock === 'low') return { label:'Only a few left', cls:'low' };
      if (product.stock === 'out') return { label:'Out of stock',    cls:'out' };
      return null;
    }

    // ── THEME ──
    function toggleTheme() {
      dark.value = !dark.value;
      document.documentElement.setAttribute('data-theme', dark.value ? 'dark' : '');
    }

    // ── SHOP ──
    function toggleCat(id) { openCats[id] = !openCats[id]; activeCat.value = id; activeSub.value = null; }
    function selectSub(catId, subId) { activeCat.value = catId; activeSub.value = subId; openCats[catId] = true; mobileDrawerOpen.value = false; }
    const currentCat = computed(() => categories.find(c => c.id === activeCat.value));
    const currentSub = computed(() => activeSub.value && currentCat.value ? currentCat.value.subs.find(s => s.id === activeSub.value) : null);
    const filteredProducts = computed(() => {
      if (!activeCat.value) return [];
      let p = allProducts.filter(p => p.catId === activeCat.value);
      if (activeSub.value) p = p.filter(p => p.subId === activeSub.value);
      return p;
    });
    function featuredProducts(catId) { return allProducts.filter(p => p.catId === catId).slice(0, 4); }

    // ── CART ──
    const MAX_QTY = 10;

    function addToCart(product) {
      if (product.stock === 'out') return;
      const existing = cart.value.find(i => i.id === product.id);
      if (existing) {
        if (existing.qty >= MAX_QTY) { showToast('Max quantity reached!', '⚠️'); return; }
        existing.qty++;
      } else { cart.value.push({ ...product, qty:1 }); }
      showToast(product.name + ' added!', '🛒');
    }

    function updateQty(item, delta) {
      const newQty = item.qty + delta;
      if (newQty > MAX_QTY) { showToast('Maximum quantity is ' + MAX_QTY, '⚠️'); return; }
      item.qty = newQty;
      if (item.qty <= 0) removeFromCart(item);
    }

    function isAtMaxQty(item) { return item.qty >= MAX_QTY; }

    function removeFromCart(item) {
      clearTimeout(undoTimer);
      removedItem.value = { ...item };
      cart.value = cart.value.filter(i => i.id !== item.id);
      undoTimer = setTimeout(() => { removedItem.value = null; }, 5000);
    }

    function undoRemove() {
      if (!removedItem.value) return;
      clearTimeout(undoTimer);
      const existing = cart.value.find(i => i.id === removedItem.value.id);
      if (existing) { existing.qty = removedItem.value.qty; }
      else { cart.value.push({ ...removedItem.value }); }
      removedItem.value = null;
      showToast('Item restored!', '↩️');
    }

    const totalItems = computed(() => cart.value.reduce((s, i) => s + i.qty, 0));
    const subtotal   = computed(() => cart.value.reduce((s, i) => s + i.price * i.qty, 0));

    // ── TOAST ──
    function showToast(msg, emoji = '🛒') {
      toast.value = msg; toastEmoji.value = emoji; toastKey.value++;
      setTimeout(() => { toast.value = ''; }, 2200);
    }

    // ── CHECKOUT ──
    function startCheckout() { checkoutStep.value = 1; view.value = 'checkout'; }

    const fieldErrors = computed(() => {
      const e = {};
      if (touched.firstName && !form.firstName)   e.firstName = 'First name is required';
      if (touched.lastName  && !form.lastName)    e.lastName  = 'Last name is required';
      if (touched.email     && !form.email)       e.email     = 'Email is required';
      if (touched.email     && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';
      if (touched.phone     && form.phone && !/^[\d\s+\-()]{7,}$/.test(form.phone)) e.phone = 'Enter a valid phone number';
      if (touched.address   && !form.address)     e.address   = 'Street address is required';
      if (touched.city      && !form.city)        e.city      = 'City is required';
      if (touched.province  && !form.province)    e.province  = 'Please select a province';
      return e;
    });

    const missingDeliveryFields = computed(() => {
      const m = [];
      if (!form.firstName) m.push('first name');
      if (!form.lastName)  m.push('last name');
      if (!form.email)     m.push('email');
      if (!form.address)   m.push('address');
      if (!form.city)      m.push('city');
      if (!form.province)  m.push('province');
      return m;
    });

    const deliveryValid = computed(() =>
      form.firstName && form.lastName && form.email && form.address && form.city && form.province &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
    );

    const paymentValid = computed(() => {
      if (!form.paymentMethod) return false;
      if (form.paymentMethod === 'card') return form.cardNumber.length >= 16 && form.cardExpiry && form.cardCvv && form.cardName;
      return true;
    });

    function touchField(name) { touched[name] = true; }

    function tryNextStep() {
      if (checkoutStep.value === 1) {
        ['firstName','lastName','email','phone','address','city','province'].forEach(f => touched[f] = true);
        if (!deliveryValid.value) return;
      }
      nextStep();
    }

    function nextStep() { if (checkoutStep.value < 3) checkoutStep.value++; }

    const paymentMethodLabel = computed(() => {
      const m = paymentMethods.find(m => m.id === form.paymentMethod);
      return m ? m.name : '';
    });

    function formatCard() {
      let v = form.cardNumber.replace(/\D/g, '').slice(0, 16);
      form.cardNumber = v.replace(/(\d{4})(?=\d)/g, '$1 ');
    }

    function formatExpiry() {
      let v = form.cardExpiry.replace(/\D/g, '').slice(0, 4);
      if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
      form.cardExpiry = v;
    }

    async function placeOrder() {
      isLoading.value = true;
      await delay(900);
      isLoading.value = false;
      orderNumber.value = 'CG-' + Math.floor(100000 + Math.random() * 900000);
      const orderDate = new Date().toLocaleDateString('en-ZA', { day:'numeric', month:'long', year:'numeric' });
      pastOrders.value.unshift({ num:orderNumber.value, date:orderDate, items:[...cart.value], total:subtotal.value });
      if (currentUser.value) currentUser.value.orders = (currentUser.value.orders || 0) + 1;
      cart.value = [];
      view.value = 'success';
    }

    function resetApp() {
      view.value = 'shop'; activeCat.value = null; activeSub.value = null; checkoutStep.value = 1;
      Object.assign(form, { firstName:'',lastName:'',email:'',phone:'',address:'',city:'',postal:'',province:'',paymentMethod:'card',cardNumber:'',cardExpiry:'',cardCvv:'',cardName:'' });
    }

    function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ── RETURN ──
    return {
      dark, view, userMenuOpen, mobileDrawerOpen, isLoading,
      currentUser, authTab, loginErr, showLoginPw, showRegPw,
      loginForm, regForm, regErrors, existingUsers, avatarOptions,
      pwStrength, canRegister, switchTab, fillLogin, doLogin, doRegister, logout, saveProfile,
      handleGlobalClick,
      activeCat, activeSub, openCats, categories, allProducts,
      currentCat, currentSub, filteredProducts, featuredProducts,
      toggleCat, selectSub, stockBadge,
      cart, totalItems, subtotal, MAX_QTY,
      addToCart, updateQty, removeFromCart, undoRemove, removedItem, isAtMaxQty,
      toast, toastEmoji, toastKey,
      checkoutStep, form, paymentMethods, fieldErrors, touched,
      missingDeliveryFields, deliveryValid, paymentValid, paymentMethodLabel,
      touchField, tryNextStep, nextStep, formatCard, formatExpiry, placeOrder, resetApp,
      startCheckout,
      orderNumber, pastOrders,
      toggleTheme,
    };
  }
}).mount('#app');
