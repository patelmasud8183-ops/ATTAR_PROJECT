
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    getDatabase,
    ref,
    set,
    get,
    push,
    update,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";

import {
    getStorage,
    ref as storageRef,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-storage.js";


/* =====================================================
   FIREBASE CONFIG
   YAHAN APNA FIREBASE CONFIG PASTE KARE
===================================================== */

const firebaseConfig = {

    apiKey: "AIzaSyAuh9P8JQjDd_VXqxKRJhoLGeuWU1RVbpU",

    authDomain:
        "mm-attar.firebaseapp.com",

    databaseURL:
        "https://mm-attar-default-rtdb.firebaseio.com",

    projectId:
        "mm-attar",

    storageBucket:
        "mm-attar.firebasestorage.app",

    messagingSenderId:
        "657413988301",

    appId:
        "1:657413988301:web:5bf7125934816a7a572e84",

    measurementId:
        "G-7Y972RWW7J"
};


/* =====================================================
   FIREBASE INITIALIZATION
===================================================== */

const firebaseApp =
    initializeApp(firebaseConfig);

const auth =
    getAuth(firebaseApp);

const db =
    getDatabase(firebaseApp);

const storage =
    getStorage(firebaseApp);


/* =====================================================
   GLOBAL DATA
===================================================== */

let currentUser = null;

let pendingNavigation =
    sessionStorage.getItem("mmAttarPendingNavigation") || "";

let products = [];

let brands = [];

let currentBrand = "all";

let cart =
    JSON.parse(
        localStorage.getItem("mmAttarCart") || "[]"
    );

let wishlist =
    JSON.parse(
        localStorage.getItem("mmAttarWishlist") || "[]"
    );

let currentCategory = "all";

let selectedProduct = null;

let selectedSize = null;

let selectedQuantity = 1;

let settings = {

    businessName: "MM ATTAR",

    whatsapp: "6351476671",

    instagram: "mm_attar_1936",

    email: "patelmasud8183@gmail.com",

    address:
        "Gujarat Society, Amod, Dist. Bharuch, Gujarat",

    upi: "",

    delivery: 50,

    cod: true
};

const defaultBrands = [
    {
        id: "mm-attar",
        name: "MM ATTAR",
        description: "Signature attars and perfumes selected for everyday luxury.",
        logo: "./Multi-artwork-1.png",
        banner: "./eau-de-parfume-bnr.webp",
        enabled: true
    },
    {
        id: "surrati",
        name: "SURRATI",
        description: "Rich oriental fragrances with a timeless character.",
        logo: "./ahmed al magribi.jpg",
        banner: "./eau-de-parfume-bnr.webp",
        enabled: true
    },
    {
        id: "ahmed-al-maghribi",
        name: "AHMED AL MAGHRIBI",
        description: "Modern Arabian perfumes and attars with distinctive depth.",
        logo: "./Perfumes – Ahmed Al Maghribi Perfumes India_files/ahmed_al_maghribi_logo_for_web.png",
        banner: "./Perfumes – Ahmed Al Maghribi Perfumes India_files/eau-de-parfume-bnr.jpg",
        enabled: true
    },
    {
        id: "ibrahim-al-qureshi",
        name: "IBRAHIM AL QURESHI",
        description: "Elegant blends inspired by heritage and contemporary style.",
        logo: "./Multi-artwork-1.png",
        banner: "./eau-de-parfume-bnr.webp",
        enabled: true
    },
    {
        id: "ajmal",
        name: "AJMAL",
        description: "Crafted fragrance compositions for every occasion.",
        logo: "./ahmed al magribi.jpg",
        banner: "./eau-de-parfume-bnr.webp",
        enabled: true
    }
];


/* =====================================================
   INITIAL PRODUCTS
===================================================== */

const defaultProducts = [
    {
        id: "attar-musk-rizali",
        name: "Musk Rizali",
        category: "attar",
        brand: "MM ATTAR",
        image:
            "https://5.imimg.com/data5/SELLER/Default/2024/9/448035159/XS/TZ/ZK/139822766/harley-davidson-perfume-500x500.jpg",
        description:
            "A rich and elegant musk fragrance with a luxurious character.",
        notes:
            "Musk, Amber, Woody",
        sizes: [
            {
                name: "6ML",
                price: 200
            },
            {
                name: "12ML",
                price: 380
            },
            {
                name: "25ML",
                price: 700
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "attar-amber-oud",
        name: "Amber Oud",
        category: "attar",
        brand: "MM ATTAR",
        image:
            "https://tse1.mm.bing.net/th/id/OIP.annLy9j2MWAdtfuQ6Mzy9AHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        description:
            "Warm amber blended with rich oud notes.",
        notes:
            "Amber, Oud, Woody",
        sizes: [
            {
                name: "6ML",
                price: 150
            },
            {
                name: "12ML",
                price: 280
            },
            {
                name: "25ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "attar-marj",
        name: "Marj",
        category: "attar",
        brand: "MM ATTAR",
            image:
                "https://img.drz.lazcdn.com/static/pk/p/6fd126cbeb4a0e603b2205029307b3c6.jpg_720x720q80.jpg_.webp",
        description:
            "A sophisticated fragrance with a smooth and luxurious aroma.",
        notes:
            "Floral, Woody, Musk",
        sizes: [
            {
                name: "6ML",
                price: 150
            },
            {
                name: "12ML",
                price: 280
            },
            {
                name: "25ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "attar-burj-khalifa",
        name: "Burj Khalifa",
        category: "attar",
        brand: "MM ATTAR",
        image:
            "https://m.media-amazon.com/images/I/81PZqytEdxL._SL1500_.jpg",
        description:
            "A bold fragrance inspired by luxury and elegance.",
        notes:
            "Oud, Amber, Musk",
        sizes: [
            {
                name: "6ML",
                price: 120
            },
            {
                name: "12ML",
                price: 220
            },
            {
                name: "25ML",
                price: 400
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "attar-khamrah-waha",
        name: "Khamrah-Waha",
        category: "attar",
        brand: "MM ATTAR",
        image:
            "https://darulmisk.com/cdn/shop/files/Khamrah.webp?v=1773427789&width=1024",
        description:
            "A warm, sweet and memorable fragrance.",
        notes:
            "Sweet, Amber, Vanilla",
        sizes: [
            {
                name: "6ML",
                price: 150
            },
            {
                name: "12ML",
                price: 280
            },
            {
                name: "25ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    },


    {
        id: "perfume-dubai-khunafa",
        name: "Dubai Khunafa",
        category: "perfume",
        brand: "MM ATTAR",
        image:
            "./WhatsApp Image 2026-09-09 at 3.04.01 PM.jpeg",
        description:
            "A modern sweet and luxurious perfume.",
        notes:
            "Sweet, Vanilla, Amber",
        sizes: [
            {
                name: "50ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "perfume-hawas-ice",
        name: "Hawas Ice",
        category: "perfume",
        brand: "MM ATTAR",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUUJrckzREv5hleGsYk5BCFeRzpCHpWEEx9yGpAd5NOA&s=10",
        description:
            "Fresh and refreshing fragrance with a modern character.",
        notes:
            "Fresh, Aquatic, Citrus",
        sizes: [
            {
                name: "50ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "perfume-hawas-for-him",
        name: "Hawas For Him",
        category: "perfume",
        brand: "MM ATTAR",
        image:
            "https://www.perfumenetwork.in/cdn/shop/files/hawas3.png?v=1769408345",
        description:
            "A confident masculine fragrance.",
        notes:
            "Woody, Fresh, Amber",
        sizes: [
            {
                name: "50ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "perfume-gucci-flora",
        name: "Gucci Flora",
        category: "perfume",
        brand: "MM ATTAR",
        image:
            "https://www.lojaglamourosa.com/resources/medias/shop/products/thumbnails/shop-image-large/shop-pf-05019-02-flora-gorgeous-gardenia-intense---50ml--1.jpg",
        description:
            "An elegant floral perfume with a sophisticated aroma.",
        notes:
            "Floral, Rose, Jasmine",
        sizes: [
            {
                name: "50ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    },

    {
        id: "perfume-9pm",
        name: "9 PM",
        category: "perfume",
        brand: "MM ATTAR",
        image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVI4KlOsa_ILiADRi9fO_ettk1BnnME67bt8fHXEsNeA&s=10",
        description:
            "A warm and attractive evening fragrance.",
        notes:
            "Vanilla, Amber, Woody",
        sizes: [
            {
                name: "50ML",
                price: 520
            }
        ],
        stock: 20,
        enabled: true
    }

];


/* =====================================================
   HELPERS
===================================================== */

const ahmedAssetFolder = "./Perfumes – Ahmed Al Maghribi Perfumes India_files/";

const ahmedProductImages = [
    "41EbdXJSLpL._SL1500.jpg", "61JMjZQWuIL._SL1500.jpg", "aayah-1.jpg",
    "aayah_e68887f6-81ff-4c23-8949-7ab23ab337b2.jpg", "Ahl-Box_7872dd1a-e0e8-432f-8c77-99cefb9c6ce3.jpg",
    "Ahl_a9f5fd69-a768-4da2-ac99-53b8299a2032.jpg", "Aqua-Oud-1.jpg", "Aqua-Oud.jpg",
    "Awfa-1-scaled.jpg", "Awfa_1bc618a6-0a5e-4fc2-833d-5922dbabb5a2.jpg", "Azure-Royal-1.jpg",
    "Azure-Royal.jpg", "Bidun-Esam-1-scaled.jpg", "Bidun-Esam.jpg", "bin-Shaikh-1.jpg",
    "Bloomsopectrumbox.jpg", "Bloomspectrumbottle.jpg", "blu-by-ahmed-1.jpg",
    "blu-by-ahmed_53941452-516e-4398-9ad3-b218f3f08359.jpg", "bombay-oud.jpg", "boumbay-oud-scaled.jpg",
    "Couture-Noir.jpg", "Couture-Noir_-1.jpg", "Dubaichocolate.jpg", "Dubaichocolatebox.jpg",
    "endless-1-1.jpg", "endless-1_febef7a0-254b-4d1b-b645-ee76d5ddb571.jpg", "exotic-box.jpg",
    "exotic_706ab836-922b-4d57-bd2e-198bb26a891a.jpg", "Frost-ice-1-1.png", "Frost-ice-2-1.png",
    "Green-pearl-box.jpg", "Green-pearl_b6853e7a-0c08-45a1-b335-e43d2842b0bb.jpg", "hirfah-1-scaled.jpg",
    "hirfah_8e213a2e-ca35-4783-97c1-37fe773b8e19.jpg", "ighraa-1.jpg",
    "ighraa_1ad186e6-da22-46b0-bdf4-7275c9f363a3.jpg", "ignite-oud-1.jpg", "Ignite-Oud-scaled.jpg",
    "igniterose.jpg", "igniteroseBottle.jpg", "Joud-100ML.jpg", "Joud_2ea034ef-1785-43a2-a6aa-0c231d50a6a6.jpg",
    "Jree.jpg", "JreeBottle.jpg", "kaaf-noir-bottle.jpg", "kaafnoirbox.jpg", "KaffeLatte.jpg",
    "kaffelattebox.jpg", "kawkab-1_4109ff12-05df-4416-bee7-db46f0b65c1c.jpg",
    "kawkab-box_5fd8ea2b-eb2a-4537-901c-004c1ac43076.jpg", "la-rosee-bottle_aacad502-191e-4ad0-8cf6-c7265424265e.jpg",
    "la-rosee-box_681054ba-d350-4501-9cec-381bba981570.jpg", "Laathani--scaled.jpg",
    "Laathani_54e7f050-ac8b-47a9-850d-c9b407b5338f.jpg", "lavender-1-scaled.jpg", "leather-1-scaled.jpg",
    "Leather_75cb1f08-837e-413c-9082-cb42b37e59b1.jpg", "Malyoon-1.jpg",
    "Malyoon_fed66c4f-65ee-4fc7-8ea0-7a55cb15c78b.jpg", "marj-1.jpg", "marj-2-scaled.jpg",
    "moonlit-1_95de0e72-7d92-472f-8218-beab3b09d427.jpg", "moonlit-2_aa15a9c0-733a-4c17-b4cb-a3ba1565d7e0.jpg",
    "mosaic-1_1354c06a-50a9-4f6f-93aa-814906381c7a.jpg", "mosaic-2_4ee6e824-2de4-4f68-88d1-fe46249a6e5c.jpg",
    "musk-ahmed-1-scaled.jpg", "Musk-Ahmed.jpg", "musk-kashmiri-box.webp", "musk-kashmiri.webp",
    "Musk-Roses-1-scaled.jpg", "Musk-Roses.jpg", "muzn-1-scaled.jpg",
    "Muzn_cdd9727c-cf0a-47b0-ade4-db7f26fcd536.jpg", "Mystique-Pink-1.jpg", "Mystique-Pink.jpg",
    "oud-clasic-scaled.png", "Oud-Classic.jpg", "oud-couture-1.jpg", "oud-couture.jpg",
    "Oud-lavender-1.jpg", "Oud-Roses-scaled.jpg", "Oulil-Amr.jpg", "oulil-scaled.jpg", "peachy-peach.jpg",
    "Rose-Noir-1.jpg", "rose-noir-scaled.jpg", "Royal-Cherry-1.jpg", "Royal-Cherry.jpg", "ruby-1.jpg",
    "ruby-2.jpg", "Scentique-white-box.jpg", "Scentique-white.jpg", "summer-oud-1.jpg",
    "summer-oud-2-scaled.jpg", "Untitled_design_-_2026-07-23T124013.462.png", "White-Tiger.jpg",
    "White-TigerBottle.jpg", "Zeleny-box.jpg", "zeleny_7f596b25-5b0c-4a4e-b38b-eff1f65d1a20.jpg"
];

const ahmedProductMetadata = {
    "oud-roses": { name: "OUD & ROSES", size: "75ML", price: 5200 },
    "kaaf": { name: "KAAF 100ML H/B", size: "100ML", price: 3600 },
    "summer-oud": { name: "SUMMER OUD 60ML H/B", size: "60ML", price: 3720 },
    "marj": { name: "MARJ 60ML", size: "60ML", price: 6400 },
    "blue-by-ahmed": { name: "BLUE BY AHMED 100ML H/B", size: "100ML", price: 3200 },
    "ignite-oud": { name: "IGNITE OUD 60ML H/B", size: "60ML", price: 5200 },
    "rose-noir": { name: "ROSE NOIR 75ML H/B", size: "75ML", price: 4400 },
    "ahl": { name: "AHL 60ML", size: "60ML", price: 6400 },
    "frost-ice": { name: "FROST ICE 100ML", size: "100ML", price: 2400 },
    "aqua-oud": { name: "AQUA OUD 90ML H/B", size: "90ML", price: 4000 },
    "kaaf-noir": { name: "KAAF NOIR", size: "100ML", price: 4000 },
    "laathani": { name: "LAATHANI 80ML H/B", size: "80ML", price: 8000 },
    "oud-classic": { name: "OUD CLASSIC 50ML", size: "50ML", price: 3200 },
    "musk-roses": { name: "MUSK & ROSES 75ML H/B", size: "75ML", price: 4400 },
    "ighraa": { name: "IGHRAA 100ML H/B", size: "100ML", price: 4000 },
    "exotic": { name: "EXOTIC 100ML", size: "100ML", price: 3200 },
    "oud-lavender": { name: "OUD LAVENDER 75ML H/B", size: "75ML", price: 5200 },
    "musk-ahmed": { name: "MUSK AHMED", size: "100ML", price: 4000 },
    "azure-royal": { name: "AZURE ROYAL 100ML H/B", size: "100ML", price: 3200 },
    "bombay-oud": { name: "BOMBAY OUD 80ML", size: "80ML", price: 6800 },
    "leather": { name: "LEATHER 50ML", size: "50ML", price: 3600 },
    "mosaic": { name: "MOSAIC 100ML", size: "100ML", price: 3200 },
    "couture-noir": { name: "COUTURE NOIR 100ML H/B", size: "100ML", price: 3200 },
    "zeleny": { name: "ZELENY 100ML H/B", size: "100ML", price: 3200 },
    "awfa": { name: "AWFA 60ML", size: "60ML", price: 9600 },
    "endless": { name: "ENDLESS 100ML", size: "100ML", price: 3600 },
    "peachy-peach": { name: "PEACHY PEACH 100ML", size: "100ML", price: 3200 },
    "muzn": { name: "MUZN 100ML", size: "100ML", price: 4400 },
    "bidun-esam": { name: "BIDUN ESAM 50ML", size: "50ML", price: 3600 },
    "ignite-rose": { name: "IGNITE ROSE", size: "100ML", price: 5200 },
    "moonlit": { name: "MOONLIT 100ML", size: "100ML", price: 3200 },
    "oulil-amr": { name: "OULIL AMR 60ML H/B", size: "60ML", price: 12800 },
    "jree": { name: "JREE", size: "100ML", price: 3200 },
    "royal-cherry": { name: "ROYAL CHERRY 100ML H/B", size: "100ML", price: 4000 },
    "musk-kashmiri": { name: "MUSK KASHMIRI", size: "100ML", price: 4000 },
    "kawkab": { name: "KAWKAB 75ML H/B", size: "75ML", price: 8400 },
    "dubai-chocolate": { name: "DUBAI CHOCOLATE", size: "100ML", price: 3200 },
    "green-pearl": { name: "GREEN PEARL 80ML", size: "80ML", price: 3600 },
    "joud": { name: "JOUD 100ML H/B", size: "100ML", price: 4000 },
    "bloom-spectrum": { name: "BLOOM SPECTRUM", size: "100ML", price: 3600 },
    "malyoon": { name: "MALYOON", size: "100ML", price: 3600 },
    "oud-couture": { name: "OUD COUTURE 100ML H/B", size: "100ML", price: 3200 },
    "hirfah": { name: "HIRFAH 75ML H/B", size: "75ML", price: 4800 },
    "la-rosee": { name: "LA ROSEE", size: "100ML", price: 6800 },
    "mystique-pink": { name: "MYSTIQUE PINK 100ML H/B", size: "100ML", price: 4000 },
    "ruby": { name: "RUBY 100ML", size: "100ML", price: 2800 },
    "kaffe-latte": { name: "KAFFE LATTE", size: "100ML", price: 3200 },
    "aayah": { name: "AAYAH", size: "100ML", price: 7600 },
    "white-tiger": { name: "WHITE TIGER", size: "100ML", price: 4800 },
    "scentique-white": { name: "SCENTIQUE WHITE 100ML H/B", size: "100ML", price: 4000 },
    "bin-shaikh": { name: "BIN SHAIKH", size: "100ML", price: 8000 }
};

const ahmedProductAliases = {
    "41ebdxjslpl.-sl1500": "kaaf",
    "61jmjzqwuil.-sl1500": "kaaf",
    "untitled-design-2026-07-23t124013.462": "oud-roses",
    "boumbay-oud": "bombay-oud",
    "bloomsopectrumbox": "bloom-spectrum",
    "bloomspectrumbottle": "bloom-spectrum",
    "dubaichocolate": "dubai-chocolate",
    "dubaichocolatebox": "dubai-chocolate",
    "igniterosebottle": "ignite-rose",
    "joud-100ml": "joud",
    "jreebottle": "jree",
    "kaafnoirbox": "kaaf-noir",
    "kaffelattebox": "kaffe-latte",
    "kaffelatte": "kaffe-latte",
    "oud-clasic": "oud-classic",
    "oulil": "oulil-amr",
    "igniterose": "ignite-rose",
    "blu-by-ahmed": "blue-by-ahmed",
    "whitetigerbottle": "white-tiger"
};

function ahmedProductKey(filename) {
    const key = filename
        .replace(/\.[^.]+$/, "")
        .replace(/_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, "")
        .replace(/(?:[-_](?:scaled|box|bottle|1|2|1-1))+$/i, "")
        .replace(/[-_]+/g, "-")
        .toLowerCase();

    return ahmedProductAliases[key] || key;
}

const importedAhmedProducts = [...new Set(
    ahmedProductImages.map(filename => ahmedProductKey(filename))
)].map((productKey, index) => {
    const metadata = ahmedProductMetadata[productKey] || {
        name: "Ahmed Al Maghribi - Product name to be confirmed",
        size: "100ML",
        price: 3200
    };
    const imageFiles = ahmedProductImages.filter(
        filename => ahmedProductKey(filename) === productKey
    );
    const firstImageIndex = ahmedProductImages.indexOf(imageFiles[0]);

    return {
        id: `ahmed-al-maghribi-${firstImageIndex + 1}`,
        name: metadata.name,
        category: "perfume",
        brand: "AHMED AL MAGHRIBI",
        image: `${ahmedAssetFolder}${imageFiles[0]}`,
        images: imageFiles.map(filename => `${ahmedAssetFolder}${filename}`),
        description: `${metadata.name} by Ahmed Al Maghribi.`,
        notes: "Premium fragrance",
        sizes: [{ name: metadata.size, price: metadata.price }],
        stock: 20,
        enabled: true
    };
});

const importedAhmedProductsById = new Map(
    importedAhmedProducts.map(product => [product.id, product])
);

const importedLocalProducts = [
    [
        "ibraheem-al-qureshi-blue-oud",
        "Ibraheem Al Qurashi Blue Oud Eau De Parfum 100ml For Men & Women",
        "4_0a33c2b9-e7b8-4d2f-a729-adb3904000c1.png",
        3749,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-musk-kashmir",
        "Ibraheem Al Qurashi Musk Kashmir Eau De Parfum 100ml For Men & Women",
        "1_c57162cc-94d8-4dfe-8248-450a5480788f.png",
        3899,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-black-diamond-incense",
        "Ibraheem Al Qurashi Black Diamond Incense Eau De Parfum 150ml For Men",
        "9_91ca5755-50e7-49f9-a99d-f1b682a23bc2.png",
        4449,
        "150ML"
    ],
    [
        "ibraheem-al-qureshi-sandalwood",
        "Ibraheem Al Qurashi Sandalwood Eau De Parfum 100ml For Man & Woman",
        "7_12bc9f08-760c-4648-8615-892bcc201800.png",
        4749,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-tobacco-discovery-set",
        "Discovery Set Of Ibraheem Al Qurashi Tobacco Collection Eau De Parfum 20ML x 9 For Man",
        "16_7bb5a775-ea9a-4533-b284-c8bede73a2ed.png",
        9499,
        "20ML x 9"
    ],
    [
        "ibraheem-al-qureshi-cullinan-diamond-iris",
        "Ibraheem Al Qurashi Cullinan Diamond Iris Extrait De Parfum 150ml For Men & Women",
        "30_7afb6d22-5fd3-4cb9-af92-6334980a3e52.jpg",
        4999,
        "150ML"
    ],
    [
        "ibraheem-al-qureshi-blue-diamond-aqua",
        "Ibraheem Al Qurashi Blue Diamond Aqua Eau De Parfum 150ml For Men",
        "1_4477d5fd-e500-4581-9a0d-7a143ae8d646.png",
        5999,
        "150ML"
    ],
    [
        "ibraheem-al-qureshi-pink-diamond-sakura",
        "Ibraheem Al Qurashi Pink Diamond Sakura Extrait De Parfum 150ml For Woman",
        "15_f9b2167c-8575-41ad-88a2-2d09ccbb0d59.png",
        4999,
        "150ML"
    ],
    [
        "ibraheem-al-qureshi-brazilian-tobacco",
        "Ibraheem Al Qurashi Brazilian Tobacco Extrait De Parfum 100ml For Man & Woman",
        "9_ebd9f57a-82f9-4974-8ba0-29c5eb942b74.png",
        4499,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-dominican-tobacco",
        "Ibraheem Al Qurashi Dominican Tobacco Extrait De Parfum 100ml For Man & Woman",
        "30_5e8b7116-f9a3-4a37-b660-a9097f2d5d0f.png",
        7449,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-white-regent-diamond",
        "Ibraheem Al Qurashi White Regent Diamond Eau De Parfum 150ml For Men & Women",
        "7_326f575a-3b2d-4c41-836f-4b2d8fe79242.png",
        6249,
        "150ML"
    ],
    [
        "ibraheem-al-qureshi-greek-tobacco",
        "Ibraheem Al Qurashi Greek Tobacco Extrait De Parfum 200ml For Men & Women",
        "26_1864af5b-3a69-4c3a-855f-bf7505e3da27.png",
        10249,
        "200ML"
    ],
    [
        "ibraheem-al-qureshi-french-tobacco",
        "Ibraheem Al Qurashi French Tobacco Extrait De Parfum 200ml For Men & Women",
        "Ibraheem_Al_Qurashi_French_Tobacco_Extrait_De_Parfum_200ml_For_Men_Women.jpg",
        10249,
        "200ML"
    ],
    [
        "ibraheem-al-qureshi-abaq-pomegranate-musk",
        "Ibraheem Al Qurashi Abaq Pomegranate Musk Eau De Parfum 75ml For Men & Women",
        "5_449abf2c-ee0d-49bf-964d-efdcc2d99a5a.png",
        3499,
        "75ML"
    ],
    [
        "ibraheem-al-qureshi-vintage-tobacco-gift-set",
        "Gift Set Of Ibraheem Al Qurashi Vintage Tobacco Extrait De Parfum 100ml For Man",
        "27_ea35e2b3-5938-4e27-8f72-7135d523b8f7.png",
        7789,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-mexican-tobacco",
        "Ibraheem Al Qurashi Mexican Tobacco Extrait De Parfum 100ml For Man & Woman",
        "7_d00962a3-6116-443b-a09e-8ccf60051c4e.png",
        4449,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-black-carbon-diamond",
        "Ibraheem Al Qurashi Black Carbon Diamond Eau De Parfum 150ml For Men",
        "2_8212391b-b80b-4429-85a8-465f408c6de3.png",
        7499,
        "150ML"
    ],
    [
        "ibraheem-al-qureshi-dark-lavender",
        "Ibraheem Al Qurashi Dark Lavender Eau De Parfum For Man & Woman",
        "11_88875dc3-077a-439d-81d6-83a45d901f7b.png",
        3699,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-emerald-soul-diamond",
        "Ibraheem Al Qurashi Emerald Soul Diamond Eau De Parfum 150ml For Men & Women",
        "3_87793e1e-e59f-4c7d-b6ec-f4550b7ebcb0.png",
        6999,
        "150ML"
    ],
    [
        "ibraheem-al-qureshi-grey-pearl-diamond",
        "Ibraheem Al Qurashi Grey Pearl Diamond Eau De Parfum 200ml For Men & Women",
        "4_f7bd12d7-fa96-469f-9177-5e90251d6de5.png",
        8499,
        "200ML"
    ],
    [
        "ibraheem-al-qureshi-iconic-oudh-tobacco",
        "Ibraheem Al Qurashi Iconic Oudh Tobacco Eau De Parfum 100ml For Man & Woman",
        "15_17b4b8e9-ea8c-40fe-8b34-cbdeb195e5e3.png",
        7499,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-golden-amber",
        "Ibraheem Al Qurashi Golden Amber Eau De Parfum 100ml For Men & Women",
        "28_2f051e7d-e812-45b2-b26e-322035535aee.jpg",
        4499,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-arabian-tobacco",
        "Ibraheem Al Qurashi Arabian Tobacco Extrait De Parfum 100ml For Man & Woman",
        "8_bbabdc6e-9ee9-4562-acb3-f9063d068561.png",
        6349,
        "100ML"
    ],
    [
        "ibraheem-al-qureshi-malayan-lthr",
        "Ibraheem Al Qurashi Malayan Lthr Eau De Parfum 75ml For Men & Women",
        "11_c30324ac-799e-488e-b0cd-a2f8cad0e866.png",
        3249,
        "75ML"
    ],
    [
        "ibraheem-al-qureshi-manta-lthr",
        "Ibraheem Al Qurashi Manta LTHR Eau De Parfum 75ml For Men & Women",
        "12_63bbf495-6f82-4319-a6d5-91cfe8f6ded8.png",
        3249,
        "75ML"
    ],
    [
        "ibraheem-al-qureshi-riviera-sunset",
        "Ibraheem Al Qurashi Riviera Sunset Eau De Parfum 100ml For Man & Woman",
        "23_03ee7e31-1eb4-438c-9915-fc70ac52e73e.png",
        3649,
        "100ML"
    ],
    [
        "ajmal-cyan-oud",
        "Ajmal Cyan Oud Eau de Parfum 100ml",
        "Ajmal-Cyan-Oud.jpg",
        2299,
        "100ML"
    ],
    [
        "ajmal-white-oud",
        "Ajmal White Oud Eau de Parfum 100ml",
        "Ajmal-White-Oud.jpg",
        1599,
        "100ML"
    ],
    [
        "ajmal-oud-nirvana",
        "Ajmal Oud Nirvana Eau De Parfum 100ml",
        "Ajmal-Oud-Nirvana.jpg",
        1599,
        "100ML"
    ],
    [
        "ajmal-amber-wood",
        "Ajmal Amber Wood Eau De Parfum 100ml",
        "Ajmal-Amber-Wood.jpg",
        11799,
        "100ML"
    ],
    [
        "ajmal-wave",
        "Ajmal Wave Eau de Parfum for Men 100ml",
        "Ajmal-Wave.jpg",
        1399,
        "100ML"
    ]
].map(([id, name, image, price, size]) => ({
    id,
    name,
    category: "perfume",
    brand: id.startsWith("ajmal-") ? "AJMAL" : "IBRAHEEM AL QURESHI",
    image: id.startsWith("ajmal-")
        ? `./Ajmal Cyan Oud Eau de Parfum 100ml – Perfumegyaan_files/${image}`
        : `./Ibraheem Al Qurashi _ Perfume Palace_files/${image}`,
    images: [id.startsWith("ajmal-")
        ? `./Ajmal Cyan Oud Eau de Parfum 100ml – Perfumegyaan_files/${image}`
        : `./Ibraheem Al Qurashi _ Perfume Palace_files/${image}`],
    description: `${name} sourced from the official online listing.`,
    notes: "Premium fragrance",
    sizes: [{ name: size, price }],
    stock: 20,
    rating: 4.8,
    enabled: true
}));

const importedLocalProductsById = new Map(
    importedLocalProducts.map(product => [product.id, product])
);

const $ = id =>
    document.getElementById(id);


function updateSeo(title, description, product = null) {
    document.title = title;
    const descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag) descriptionTag.content = description;
    const canonical = document.querySelector("#canonicalLink");
    if (canonical) canonical.href = `${window.location.origin}${window.location.pathname}`;
    const structuredData = document.querySelector("#productStructuredData");
    if (!structuredData) return;
    structuredData.textContent = product
        ? JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: (product.images || [product.image]).filter(Boolean),
            description: product.description || `${product.name} at MM ATTAR`,
            brand: {
                "@type": "Brand",
                name: product.brand || "MM ATTAR"
            },
            offers: {
                "@type": "Offer",
                priceCurrency: "INR",
                price: Number(product.sizes?.[0]?.price || 0),
                availability: Number(product.stock || 0) > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock"
            }
        })
        : "{}";
}

function money(value) {
    return "₹" +
        Number(value || 0)
            .toLocaleString("en-IN");

}


function escapeHTML(value) {

    return String(value ?? "")
        .replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char]));

}


function showToast(message) {

    const toast = $("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);

}


function generateOrderId() {

    const date =
        new Date()
            .toISOString()
            .slice(0,10)
            .replaceAll("-","");

    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return `MM-${date}-${random}`;

}


/* =====================================================
   AUTH UI
===================================================== */

function showLogin() {

    $("loginForm").classList.remove("hidden");

    $("registerForm").classList.add("hidden");

}


function showRegister() {

    $("loginForm").classList.add("hidden");

    $("registerForm").classList.remove("hidden");

}


window.showLogin = showLogin;
window.showRegister = showRegister;


function togglePassword(id) {

    const input = $(id);

    input.type =
        input.type === "password"
            ? "text"
            : "password";

}


window.togglePassword = togglePassword;


/* =====================================================
   REGISTER
===================================================== */

async function registerUser() {

    const name =
        $("registerName").value.trim();

    const phone =
        $("registerPhone").value.trim();

    const email =
        $("registerEmail").value.trim();

    const password =
        $("registerPassword").value;

    const confirm =
        $("registerConfirm").value;


    if (!name || !phone || !email || !password) {

        showToast("Please fill all fields.");

        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showToast("Please enter a valid email address.");
        return;
    }

    if (!/^[0-9+()\-\s]{10,15}$/.test(phone)) {
        showToast("Please enter a valid mobile number.");
        return;
    }


    if (password.length < 6) {

        showToast(
            "Password must contain at least 6 characters."
        );

        return;
    }


    if (password !== confirm) {

        showToast("Passwords do not match.");

        return;
    }


    try {

        const result =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


        await set(
            ref(db, "users/" + result.user.uid),
            {
                uid: result.user.uid,
                name,
                phone,
                email,
                createdAt: Date.now(),
                role: "customer"
            }
        );


        showToast(
            "Account created successfully!"
        );

    }

    catch (error) {

        const messages = {
            "auth/email-already-in-use": "An account already exists with this email.",
            "auth/invalid-email": "Please enter a valid email address.",
            "auth/weak-password": "Use a stronger password with at least 6 characters.",
            "auth/network-request-failed": "Network error. Check your connection and try again."
        };

        showToast(messages[error.code] || "Registration failed. Please try again.");

    }

}


window.registerUser = registerUser;


/* =====================================================
   LOGIN
===================================================== */

async function loginUser() {

    const email =
        $("loginEmail").value.trim();

    const password =
        $("loginPassword").value;


    if (!email || !password) {

        showToast("Enter email and password.");

        return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        showToast("Please enter a valid email address.");
        return;
    }


    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        showToast("Login successful!");

    }

    catch (error) {

        const messages = {
            "auth/invalid-credential":
                "Email or password is incorrect.",
            "auth/invalid-login-credentials":
                "Email or password is incorrect.",
            "auth/user-not-found":
                "No account found with this email.",
            "auth/wrong-password":
                "Password is incorrect.",
            "auth/invalid-email":
                "Please enter a valid email address.",
            "auth/user-disabled":
                "This account has been disabled.",
            "auth/too-many-requests":
                "Too many attempts. Please try again later.",
            "auth/operation-not-allowed":
                "Email login is disabled in Firebase Authentication.",
            "auth/network-request-failed":
                "Network error. Check your connection and try again."
        };

        console.error("Login failed:", error);

        showToast(
            messages[error.code] ||
            "Login failed. Please check Firebase Authentication settings."
        );

    }

}


window.loginUser = loginUser;


/* =====================================================
   FORGOT PASSWORD
===================================================== */

async function forgotPassword() {

    const email =
        $("loginEmail").value.trim();


    if (!email) {

        showToast(
            "Enter your email first."
        );

        return;
    }


    try {

        await sendPasswordResetEmail(
            auth,
            email
        );

        showToast(
            "Password reset email sent."
        );

    }

    catch {

        showToast(
            "Could not send reset email."
        );

    }

}


window.forgotPassword = forgotPassword;


/* =====================================================
   AUTH STATE
===================================================== */

onAuthStateChanged(
    auth,
    async user => {

        $("loader").style.display = "none";


        if (user) {

            currentUser = user;

            $("authSection")
                .classList.add("hidden");

            $("mainWebsite")
                .classList.remove("hidden");


            await loadUserProfile();

            await loadSettings();

            await loadProducts();

            await loadBrands();

            updateCartCount();

            const destination = pendingNavigation || "home";
            pendingNavigation = "";
            sessionStorage.removeItem("mmAttarPendingNavigation");
            showPage(destination);

            checkAdmin(user.uid);

        }

        else {

            currentUser = null;

            $("authSection")
                .classList.add("hidden");

            $("mainWebsite")
                .classList.remove("hidden");

            await loadSettings();

            await loadProducts();

            await loadBrands();

            updateCartCount();

            showPage("home");

        }

    }
);


/* =====================================================
   LOAD USER
===================================================== */

async function loadUserProfile() {

    if (!currentUser) return;


    try {

        const snapshot =
            await get(
                ref(
                    db,
                    "users/" + currentUser.uid
                )
            );


        if (snapshot.exists()) {

            const user =
                snapshot.val();

            if (Array.isArray(user.wishlist)) {
                wishlist = user.wishlist;
                localStorage.setItem("mmAttarWishlist", JSON.stringify(wishlist));
            }


            $("headerUserName")
                .textContent =
                user.name || "Account";

            $("profileName")
                .textContent =
                user.name || "Customer";

            $("profileEmail")
                .textContent =
                user.email || "";

            $("profilePhone")
                .textContent =
                user.phone || "";

            $("profileInitial")
                .textContent =
                (user.name || "M")
                    .charAt(0)
                    .toUpperCase();

        }

    }

    catch (error) {

        console.error(error);

    }

}


/* =====================================================
   LOGOUT
===================================================== */

async function logoutUser() {

    await signOut(auth);

    showToast("Logged out.");

}


window.logoutUser = logoutUser;


/* =====================================================
   PRODUCTS
===================================================== */

async function loadProducts() {

    try {

        const snapshot =
            await get(
                ref(db, "products")
            );


        if (snapshot.exists()) {

            const data =
                snapshot.val();

            products =
                Object.entries(data)
                    .map(([id, value]) => {
                        const defaultProduct =
                            defaultProducts.find(
                                product => product.id === id
                            );

                        const oldDuplicateImage =
                            "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=85";

                        const legacyImages = {
                            "attar-musk-rizali": [
                                oldDuplicateImage
                            ],
                            "attar-amber-oud": [
                                "https://fimgs.net/mdimg/perfume-thumbs/375x500.108764.jpg"
                            ],
                            "attar-marj": [
                                "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=85"
                            ],
                            "attar-burj-khalifa": [
                                "https://roshnief.com/cdn/shop/files/burj_khalifa_dbca399e-0cfa-4961-a87c-911449da1aeb.png?v=1768638926&width=1800"
                            ],
                            "attar-khamrah-waha": [
                                "https://images.unsplash.com/photo-1610461888750-10bfc601b8a1?auto=format&fit=crop&w=800&q=85"
                            ]
                        };

                        const isLegacyImage =
                            legacyImages[id]?.includes(value.image);

                        const useRequestedImage =
                            [
                                "attar-musk-rizali",
                                "attar-amber-oud",
                                "attar-marj",
                                "attar-burj-khalifa",
                                "attar-khamrah-waha",
                                "perfume-dubai-khunafa",
                                "perfume-hawas-for-him",
                                "perfume-hawas-ice",
                                "perfume-gucci-flora",
                                "perfume-9pm"
                            ].includes(id);

                        return {
                            id,
                            ...value,
                            image:
                                (useRequestedImage || isLegacyImage) &&
                                defaultProduct
                                    ? defaultProduct.image
                                    : value.image
                        };
                    });

                products = products
                    .filter(product => !(
                        product.brand === "AHMED AL MAGHRIBI" &&
                        /^ahmed-al-maghribi-\d+$/.test(product.id) &&
                        !importedAhmedProductsById.has(product.id)
                    ))
                    .map(product => {
                        const importedProduct =
                            importedAhmedProductsById.get(product.id);

                        if (!importedProduct) return product;

                        return {
                            ...importedProduct,
                            ...product,
                            name: importedProduct.name,
                            description: importedProduct.description,
                            notes: importedProduct.notes,
                            sizes: importedProduct.sizes,
                            images: [...new Set([
                                product.image,
                                ...importedProduct.images
                            ].filter(Boolean))]
                        };
                    });

                const existingIds = new Set(products.map(product => product.id));
                products.push(
                    ...importedAhmedProducts.filter(product => !existingIds.has(product.id))
                );

        }

        else {

            products =
                [...defaultProducts, ...importedAhmedProducts];

            for (const product of products) {

                await set(
                    ref(
                        db,
                        "products/" +
                        product.id
                    ),
                    product
                );

            }

        }

    }

    catch (error) {

        console.warn(
            "Firebase products unavailable.",
            error
        );

        products = [...defaultProducts, ...importedAhmedProducts];

    }

    const muskRizali =
        products.find(
            product => product.id === "attar-musk-rizali"
        );

    const muskRizaliPrices = {
        "6ML": 200,
        "12ML": 380,
        "25ML": 700
    };

    const muskRizaliPriceChanged =
        muskRizali?.sizes?.some(size => {
            const sizeName =
                String(size.name).toUpperCase();

            const expectedPrice =
                muskRizaliPrices[sizeName];

            if (
                expectedPrice === undefined ||
                Number(size.price) === expectedPrice
            ) {
                return false;
            }

            size.price = expectedPrice;

            return true;
        });

    if (muskRizali && muskRizaliPriceChanged) {

        try {
            await update(
                ref(
                    db,
                    "products/attar-musk-rizali"
                ),
                {
                    sizes: muskRizali.sizes
                }
            );
        }

        catch (error) {

            console.warn(
                "Could not persist Musk Rizali price update.",
                error
            );

        }
    }

    populateProductFilters();

    renderFeaturedProducts();

}


function populateProductFilters() {

    const brandFilter = $("brandFilter");
    const fragranceFilter = $("fragranceFilter");

    if (!brandFilter || !fragranceFilter) return;

    const brands = [...new Set(products.map(product => product.brand).filter(Boolean))].sort();
    const notes = [...new Set(products.flatMap(product => String(product.notes || "").split(",").map(note => note.trim()).filter(Boolean)))].sort();

    brandFilter.innerHTML = `<option value="all">All Brands</option>` +
        brands.map(brand => `<option value="${escapeHTML(brand)}">${escapeHTML(brand)}</option>`).join("");

    fragranceFilter.innerHTML = `<option value="all">All Notes</option>` +
        notes.map(note => `<option value="${escapeHTML(note)}">${escapeHTML(note)}</option>`).join("");

}


async function loadBrands() {

    try {
        const snapshot = await get(ref(db, "brands"));
        const remoteBrands = snapshot.exists()
            ? Object.entries(snapshot.val()).map(([id, value]) => ({ id, ...value }))
            : [];

        const productBrands = [...new Set(products.map(product => product.brand).filter(Boolean))]
            .map(name => ({
                id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                name,
                description: `${name} fragrance collection at MM ATTAR.`,
                logo: "./Multi-artwork-1.png",
                banner: "./eau-de-parfume-bnr.webp",
                enabled: true
            }));

        const merged = [...defaultBrands, ...productBrands, ...remoteBrands];
        brands = [...new Map(merged.map(brand => [brand.id, brand])).values()];
    }
    catch (error) {
        console.warn("Firebase brands unavailable.", error);
        brands = defaultBrands.filter(brand => brand.enabled !== false);
    }

    renderBrandCards();

}


function renderBrandCards() {

    const container = $("brandCards");
    if (!container) return;

    container.innerHTML = brands.filter(brand => brand.enabled !== false).map(brand => `
        <button class="brand-card" onclick="showBrand('${escapeHTML(brand.id)}')">
            <span class="brand-card-logo">
                <img src="${escapeHTML(brand.logo || "./Multi-artwork-1.png")}" alt="${escapeHTML(brand.name)} logo" loading="lazy">
            </span>
            <strong>${escapeHTML(brand.name)}</strong>
            <small>Explore collection <span aria-hidden="true">→</span></small>
        </button>
    `).join("");

}


function showBrand(brandId) {

    const brand = brands.find(item => item.id === brandId);
    if (!brand || brand.enabled === false) {
        showToast("Brand not found.");
        return;
    }

    currentBrand = brand.id;
    currentCategory = "all";
    showPage("brand");

    $("brandPageTitle").textContent = brand.name;
    $("brandPageDescription").textContent = brand.description || "Explore this fragrance collection.";
    $("brandPageImage").src = brand.banner || brand.logo || "./eau-de-parfume-bnr.webp";
    $("brandPageImage").alt = `${brand.name} fragrance collection`;

    renderBrandProducts();

}


function showBrandProducts(category = "all") {
    currentCategory = category;
    renderBrandProducts();
}


function renderBrandProducts() {

    const container = $("brandProductsGrid");
    if (!container) return;

    const brand = brands.find(item => item.id === currentBrand);
    const brandName = brand?.name?.toLowerCase();
    const list = products.filter(product =>
        product.enabled !== false &&
        (!brandName || String(product.brand || "").toLowerCase() === brandName) &&
        (currentCategory === "all" || product.category === currentCategory)
    );

    container.innerHTML = list.length
        ? list.map(productCard).join("")
        : `<div class="empty-state"><h3>No products in this collection yet</h3><p>Check back soon for new arrivals.</p></div>`;

}


window.showBrand = showBrand;
window.showBrandProducts = showBrandProducts;


/* =====================================================
   PRODUCT CARD
===================================================== */

function productCard(product) {

    const firstSize =
        product.sizes?.[0];

    const price =
        firstSize?.price || 0;

    const stock =
        Number(product.stock || 0);

    const wished = wishlist.includes(product.id);
    const stockText = stock <= 0
        ? "OUT OF STOCK"
        : stock <= 5
            ? `ONLY ${stock} LEFT`
            : "IN STOCK";

    return `

        <div class="product-card">

            <div
                class="product-image"
                onclick="openProduct('${product.id}')">

                <img
                    src="${escapeHTML(product.images?.[0] || product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    onerror="this.onerror=null; this.src='${product.id === "attar-burj-khalifa" ? "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80" : "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"}'"
                >

                <span
                    class="stock-label ${stock <= 0 ? "out" : ""}">

                    ${stockText}

                </span>

                <button
                    class="wishlist-btn ${wished ? "active" : ""}"
                    aria-label="${wished ? "Remove from" : "Add to"} wishlist"
                    onclick="toggleWishlist('${product.id}', event)">
                    ${wished ? "♥" : "♡"}
                </button>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(
                        product.category.toUpperCase()
                    )}
                </span>

                <h3>
                    ${escapeHTML(product.name)}
                </h3>

                <div class="product-brand">
                    ${escapeHTML(product.brand || "MM ATTAR")}
                </div>

                <div class="product-price">
                    From ${money(price)}
                </div>

                <div class="product-rating" aria-label="Rated ${Number(product.rating || 0).toFixed(1)} out of 5">
                    ★ ${Number(product.rating || 0).toFixed(1)} <span>(${product.reviewCount || 0} reviews)</span>
                </div>


                <div class="product-actions">

                    <button
                        class="view-btn"
                        onclick="openProduct('${product.id}')">

                        View

                    </button>

                    <button
                        class="add-btn"
                        ${
                            stock <= 0
                                ? "disabled"
                                : ""
                        }
                        onclick="quickAdd('${product.id}')">

                        Add to Cart

                    </button>

                </div>

            </div>

        </div>
    `;

}


/* =====================================================
   FEATURED
===================================================== */

function renderFeaturedProducts() {

    const container =
        $("featuredProducts");

    if (!container) return;

    container.innerHTML =
        products
            .filter(p => p.enabled !== false)
            .slice(0,8)
            .map(productCard)
            .join("");

}


function saveWishlist() {

    localStorage.setItem("mmAttarWishlist", JSON.stringify(wishlist));

    if (currentUser) {
        update(ref(db, `users/${currentUser.uid}`), {
            wishlist
        }).catch(error => console.warn("Wishlist sync failed.", error));
    }

}


function toggleWishlist(productId, event) {

    event?.stopPropagation();

    if (wishlist.includes(productId)) {
        wishlist = wishlist.filter(id => id !== productId);
        showToast("Removed from wishlist.");
    } else {
        wishlist.push(productId);
        showToast("Added to wishlist.");
    }

    saveWishlist();
    renderFeaturedProducts();

    if (!$('productsPage').classList.contains('hidden')) {
        filterProducts();
    }

    if (!$('wishlistTab').classList.contains('hidden')) {
        renderWishlist();
    }

}


function renderWishlist() {

    const container = $("wishlistGrid");
    if (!container) return;

    const savedProducts = wishlist
        .map(id => products.find(product => product.id === id))
        .filter(Boolean);

    container.innerHTML = savedProducts.length
        ? savedProducts.map(productCard).join("")
        : `<div class="empty-state"><h3>Your wishlist is empty</h3><p>Save fragrances here while you browse.</p></div>`;

}


window.toggleWishlist = toggleWishlist;
window.renderWishlist = renderWishlist;


/* =====================================================
   SHOW PRODUCTS
===================================================== */

function showProducts(category = "all") {

    currentCategory = category;
    currentBrand = "all";
    updateSeo(
        category === "attar" ? "Buy Premium Attars | MM ATTAR" :
            category === "perfume" ? "Buy Premium Perfumes | MM ATTAR" :
                "MM ATTAR | Premium Attar & Perfumes",
        category === "attar" ? "Explore premium attars from MM ATTAR in rich, lasting fragrance blends." :
            category === "perfume" ? "Shop premium perfumes from MM ATTAR for every occasion." :
                "Shop premium attars and perfumes from MM ATTAR in Amod, Bharuch, Gujarat."
    );

    showPage("products");

    const title =
        category === "attar"
            ? "Attar Collection"
            : category === "perfume"
                ? "Perfume Collection"
                : "All Products";


    $("productPageTitle")
        .textContent = title;


    $("productPageSmall")
        .textContent =
        category === "attar"
            ? "PURE FRAGRANCE"
            : category === "perfume"
                ? "MODERN LUXURY"
                : "COLLECTION";


    $("productSearch").value = "";

    renderProducts();

}


window.showProducts = showProducts;


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(list = null) {

    const container =
        $("productsGrid");

    if (!container) return;


    let data =
        list ||
        products.filter(
            p =>
                p.enabled !== false &&
                (
                    currentCategory === "all" ||
                    p.category === currentCategory
                ) &&
                (
                    currentBrand === "all" ||
                    String(p.brand || "").toLowerCase() ===
                        String(brands.find(brand => brand.id === currentBrand)?.name || "").toLowerCase()
                )
        );


    if (!data.length) {

        container.innerHTML = `
            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:60px;
            ">
                <h2>No products found</h2>
                <p>Try another search.</p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        data.map(productCard).join("");

}


/* =====================================================
   FILTER
===================================================== */

function filterProducts() {

    const search =
        $("productSearch")
            .value
            .toLowerCase()
            .trim();

    const priceFilter =
        $("priceFilter").value;

    const stockFilter =
        $("stockFilter").value;

    const brandFilter =
        $("brandFilter")?.value || "all";

    const fragranceFilter =
        $("fragranceFilter")?.value || "all";

    const sortProducts =
        $("sortProducts")?.value || "featured";


    const filtered =
        products.filter(product => {

            if (
                product.enabled === false
            ) return false;


            if (
                currentCategory !== "all" &&
                product.category !== currentCategory
            ) return false;


            const searchMatch =
                !search ||
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.category
                    .toLowerCase()
                    .includes(search) ||
                (product.brand || "")
                    .toLowerCase()
                    .includes(search) ||
                (product.notes || "")
                    .toLowerCase()
                    .includes(search);


            if (!searchMatch)
                return false;


            const price =
                Number(
                    product.sizes?.[0]?.price || 0
                );


            if (priceFilter === "0-500" &&
                price > 500)
                return false;


            if (priceFilter === "500-1000" &&
                (price < 500 || price > 1000))
                return false;


            if (priceFilter === "1000+" &&
                price < 1000)
                return false;


            const stock =
                Number(product.stock || 0);


            if (
                stockFilter === "in" &&
                stock <= 0
            )
                return false;


            if (
                stockFilter === "out" &&
                stock > 0
            )
                return false;

            if (
                brandFilter !== "all" &&
                product.brand !== brandFilter
            )
                return false;

            if (
                fragranceFilter !== "all" &&
                !String(product.notes || "")
                    .toLowerCase()
                    .split(",")
                    .map(note => note.trim().toLowerCase())
                    .includes(fragranceFilter.toLowerCase())
            )
                return false;


            return true;

        });

    filtered.sort((left, right) => {
        const leftPrice = Number(left.sizes?.[0]?.price || 0);
        const rightPrice = Number(right.sizes?.[0]?.price || 0);

        if (sortProducts === "price-asc") return leftPrice - rightPrice;
        if (sortProducts === "price-desc") return rightPrice - leftPrice;
        if (sortProducts === "name") return left.name.localeCompare(right.name);
        return Number(right.bestSeller || right.featured || 0) - Number(left.bestSeller || left.featured || 0);
    });


    renderProducts(filtered);

}


window.filterProducts = filterProducts;


/* =====================================================
   SEARCH
===================================================== */

function searchProducts(value) {

    if (!$("productsPage"))
        return;


    showProducts("all");

    $("productSearch").value =
        value;

    filterProducts();

}


window.searchProducts = searchProducts;


function openSearch() {

    $("searchPanel")
        .classList.add("active");

    $("searchInput").focus();

}


function closeSearch() {

    $("searchPanel")
        .classList.remove("active");

}


window.openSearch = openSearch;
window.closeSearch = closeSearch;


/* =====================================================
   PRODUCT DETAILS
===================================================== */

function openProduct(productId) {

    const product =
        products.find(
            p => p.id === productId
        );


    if (!product) {

        showToast("Product not found.");

        return;
    }


    selectedProduct = product;

    selectedSize =
        product.sizes?.[0] || null;

    selectedQuantity = 1;
    updateSeo(
        `${product.name} | ${product.brand || "MM ATTAR"} | MM ATTAR`,
        product.description || `${product.name} ${product.category} available at MM ATTAR.`,
        product
    );


    showPage("productDetails");

    renderProductDetails();

}


window.openProduct = openProduct;


function renderProductDetails() {

    const p =
        selectedProduct;


    const stock =
        Number(p.stock || 0);


    const price =
        selectedSize?.price || 0;


    $("productDetails").innerHTML = `

        <div class="detail-image">

            <img
                src="${escapeHTML(p.images?.[0] || p.image)}"
                alt="${escapeHTML(p.name)}"
                referrerpolicy="no-referrer"
                onerror="this.onerror=null; this.src='${p.id === "attar-burj-khalifa" ? "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80" : "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"}'"
            >

        </div>


        <div class="detail-info">

            <span class="detail-category">
                ${p.category.toUpperCase()}
            </span>

            <h1>
                ${escapeHTML(p.name)}
            </h1>

            <div class="detail-brand">
                ${escapeHTML(
                    p.brand || "MM ATTAR"
                )}
            </div>

            <div class="product-rating detail-rating">
                ★ ${Number(p.rating || 0).toFixed(1)}
                <span>${p.reviewCount || 0} customer reviews</span>
            </div>


            <div class="detail-description">
                ${escapeHTML(
                    p.description || ""
                )}
            </div>


            <div class="detail-notes">

                <strong>
                    Fragrance Notes:
                </strong>

                <br>

                ${escapeHTML(
                    p.notes || "Premium fragrance"
                )}

            </div>


            <h3>Choose Size</h3>

            <div class="size-options">

                ${
                    (p.sizes || [])
                        .map((size,index) => `

                            <button
                                class="
                                    size-option
                                    ${
                                        selectedSize === size
                                            ? "active"
                                            : ""
                                    }
                                "
                                onclick="selectSize(${index})">

                                ${escapeHTML(size.name)}
                                -
                                ${money(size.price)}

                            </button>

                        `)
                        .join("")
                }

            </div>


            <div class="detail-price">

                ${money(price)}

            </div>


            <div class="quantity-box">

                <button
                    onclick="changeDetailQuantity(-1)">
                    −
                </button>

                <span>
                    ${selectedQuantity}
                </span>

                <button
                    onclick="changeDetailQuantity(1)">
                    +
                </button>

            </div>


            <p>
                ${
                    stock > 0
                        ? `${stock} available`
                        : "Out of Stock"
                }
            </p>


            <br>


            <button
                class="gold-btn"
                ${
                    stock <= 0
                        ? "disabled"
                        : ""
                }
                onclick="addSelectedToCart()">

                Add to Cart

            </button>

            &nbsp;

            <button
                class="outline-btn"
                ${
                    stock <= 0
                        ? "disabled"
                        : ""
                }
                onclick="buySelectedNow()">

                Buy Now

            </button>

        </div>

    `;

}


window.renderProductDetails = renderProductDetails;

function goBackToCollection() {
    showProducts(selectedProduct?.category || "all");
}

window.goBackToCollection = goBackToCollection;


/* =====================================================
   SIZE
===================================================== */

function selectSize(index) {

    if (!selectedProduct)
        return;


    selectedSize =
        selectedProduct.sizes[index];

    renderProductDetails();

}


window.selectSize = selectSize;


/* =====================================================
   DETAIL QUANTITY
===================================================== */

function changeDetailQuantity(change) {

    if (!selectedProduct)
        return;


    const stock =
        Number(
            selectedProduct.stock || 0
        );


    selectedQuantity += change;


    if (selectedQuantity < 1)
        selectedQuantity = 1;


    if (selectedQuantity > stock)
        selectedQuantity = stock;


    renderProductDetails();

}


window.changeDetailQuantity =
    changeDetailQuantity;


/* =====================================================
   CART
===================================================== */

function addToCart(
    product,
    size,
    quantity = 1
) {

    if (!product || !size)
        return;


    const stock =
        Number(product.stock || 0);


    if (stock <= 0) {

        showToast("Product is out of stock.");

        return;
    }


    const existing =
        cart.find(
            item =>
                item.productId === product.id &&
                item.size === size.name
        );


    if (existing) {

        if (
            existing.quantity + quantity >
            stock
        ) {

            showToast(
                "Not enough stock available."
            );

            return;
        }


        existing.quantity += quantity;

    }

    else {

        cart.push({

            productId: product.id,

            name: product.name,

            category: product.category,

            image: product.image,

            size: size.name,

            price: Number(size.price),

            quantity

        });

    }


    saveCart();

    showToast(
        `${product.name} added to cart.`
    );

}


function quickAdd(productId) {

    const product =
        products.find(
            p => p.id === productId
        );


    if (!product) return;


    addToCart(
        product,
        product.sizes[0],
        1
    );

}


window.quickAdd = quickAdd;


function addSelectedToCart() {

    addToCart(
        selectedProduct,
        selectedSize,
        selectedQuantity
    );

    updateCartCount();

}


window.addSelectedToCart =
    addSelectedToCart;


function buySelectedNow() {

    addSelectedToCart();

    goCheckout();

}


window.buySelectedNow =
    buySelectedNow;


/* =====================================================
   CART SAVE
===================================================== */

function saveCart() {

    localStorage.setItem(
        "mmAttarCart",
        JSON.stringify(cart)
    );

    updateCartCount();

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const count =
        cart.reduce(
            (sum,item) =>
                sum + Number(item.quantity),
            0
        );


    $("cartCount").textContent =
        count;

}


/* =====================================================
   RENDER CART
===================================================== */

function renderCart() {

    const container =
        $("cartItems");


    if (!cart.length) {

        container.innerHTML = `

            <div style="
                text-align:center;
                background:white;
                padding:70px 20px;
                border-radius:10px;
            ">

                <h2>Your cart is empty</h2>

                <p>
                    Add some beautiful fragrances.
                </p>

                <br>

                <button
                    class="gold-btn"
                    onclick="showProducts('all')">

                    Continue Shopping

                </button>

            </div>

        `;

        updateCartSummary();

        return;
    }


    container.innerHTML =
        cart.map(
            (item,index) => `

                <div class="cart-item">

                    <img
                        src="${escapeHTML(item.image)}"
                        alt="${escapeHTML(item.name)}"
                    >

                    <div class="cart-item-info">

                        <h3>
                            ${escapeHTML(item.name)}
                        </h3>

                        <div class="cart-size">
                            ${escapeHTML(item.category)}
                            •
                            ${escapeHTML(item.size)}
                        </div>

                        <strong>
                            ${money(item.price)}
                        </strong>


                        <div class="cart-quantity">

                            <button
                                onclick="changeCartQuantity(${index},-1)">
                                −
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                onclick="changeCartQuantity(${index},1)">
                                +
                            </button>

                        </div>

                    </div>


                    <div>

                        <strong>
                            ${money(
                                item.price *
                                item.quantity
                            )}
                        </strong>

                        <br><br>

                        <button
                            class="remove-btn"
                            onclick="removeFromCart(${index})">

                            Remove

                        </button>

                    </div>

                </div>

            `
        ).join("");


    updateCartSummary();

}


window.renderCart = renderCart;


/* =====================================================
   CART QUANTITY
===================================================== */

function changeCartQuantity(
    index,
    change
) {

    const item =
        cart[index];


    const product =
        products.find(
            p => p.id === item.productId
        );


    if (!product) return;


    item.quantity += change;


    if (item.quantity <= 0) {

        cart.splice(index,1);

    }

    else if (
        item.quantity >
        Number(product.stock || 0)
    ) {

        item.quantity =
            Number(product.stock || 0);

        showToast(
            "Maximum available stock reached."
        );

    }


    saveCart();

    renderCart();

}


window.changeCartQuantity =
    changeCartQuantity;


/* =====================================================
   REMOVE CART
===================================================== */

function removeFromCart(index) {

    cart.splice(index,1);

    saveCart();

    renderCart();

    showToast(
        "Product removed."
    );

}


window.removeFromCart =
    removeFromCart;


/* =====================================================
   CART SUMMARY
===================================================== */

function calculateCart() {

    const subtotal =
        cart.reduce(
            (sum,item) =>
                sum +
                Number(item.price) *
                Number(item.quantity),
            0
        );


    const delivery =
        subtotal > 0
            ? Number(settings.delivery || 0)
            : 0;


    const discount = 0;


    const total =
        subtotal +
        delivery -
        discount;


    return {
        subtotal,
        delivery,
        discount,
        total
    };

}


function updateCartSummary() {

    const data =
        calculateCart();


    $("cartSubtotal").textContent =
        money(data.subtotal);

    $("cartDelivery").textContent =
        money(data.delivery);

    $("cartDiscount").textContent =
        money(data.discount);

    $("cartTotal").textContent =
        money(data.total);

}


/* =====================================================
   CHECKOUT
===================================================== */

function goCheckout() {

    if (!cart.length) {

        showToast(
            "Your cart is empty."
        );

        return;
    }

    if (!currentUser) {
        pendingNavigation = "checkout";
        sessionStorage.setItem("mmAttarPendingNavigation", pendingNavigation);
        showToast("Please log in to continue to checkout.");
        $("authSection").classList.remove("hidden");
        $("mainWebsite").classList.add("hidden");
        showLogin();
        return;
    }


    showPage("checkout");

    renderCheckout();

}


window.goCheckout = goCheckout;


/* =====================================================
   RENDER CHECKOUT
===================================================== */

function renderCheckout() {

    if (!currentUser)
        return;


    const data =
        calculateCart();


    $("checkoutItems").innerHTML =
        cart.map(
            item => `

                <div class="checkout-item">

                    <img
                        src="${escapeHTML(item.image)}"
                    >

                    <div>

                        <strong>
                            ${escapeHTML(item.name)}
                        </strong>

                        <div>
                            ${escapeHTML(item.size)}
                            ×
                            ${item.quantity}
                        </div>

                        <small>
                            ${money(
                                item.price *
                                item.quantity
                            )}
                        </small>

                    </div>

                </div>

            `
        ).join("");


    $("checkoutSubtotal")
        .textContent =
        money(data.subtotal);


    $("checkoutDelivery")
        .textContent =
        money(data.delivery);


    $("checkoutTotal")
        .textContent =
        money(data.total);


    $("checkoutName").value = "";

    $("checkoutPhone").value = "";

    $("checkoutEmail").value =
        currentUser.email || "";


    $("checkoutUpiId").textContent =
        settings.upi ||
        "UPI ID not configured";


    if (settings.upi) {

        const upiUrl =
            "upi://pay?pa=" +
            encodeURIComponent(settings.upi) +
            "&pn=" +
            encodeURIComponent(settings.businessName) +
            "&am=" +
            encodeURIComponent(data.total) +
            "&cu=INR";


        $("upiQrContainer").innerHTML = `

            <img
                src="
                    https://api.qrserver.com/v1/create-qr-code/
                    ?size=200x200
                    &data=${encodeURIComponent(upiUrl)}
                "
                alt="UPI QR"
            >

        `;

    }

    else {

        $("upiQrContainer").innerHTML = "";

    }


    $("codOption")
        .style.display =
        settings.cod
            ? "flex"
            : "none";


}


/* =====================================================
   PAYMENT INFO
===================================================== */

function showPaymentInfo() {

    const selected =
        document.querySelector(
            'input[name="payment"]:checked'
        );


    if (!selected)
        return;


    $("upiInfo")
        .style.display =
        selected.value === "UPI"
            ? "block"
            : "none";

}


window.showPaymentInfo =
    showPaymentInfo;


/* =====================================================
   PLACE ORDER
===================================================== */

async function placeOrder() {

    if (!currentUser) {

        showToast(
            "Order place karne ke liye pehle Account banakar login karein."
        );

        $("authSection")
            .classList.remove("hidden");

        $("mainWebsite")
            .classList.add("hidden");

        showLogin();

        return;
    }


    if (!cart.length) {

        showToast("Cart is empty.");

        return;
    }


    const name =
        $("checkoutName").value.trim();

    const phone =
        $("checkoutPhone").value.trim();

    const email =
        $("checkoutEmail").value.trim();

    const address =
        $("checkoutAddress").value.trim();

    const area =
        $("checkoutArea").value.trim();

    const city =
        $("checkoutCity").value.trim();

    const pincode =
        $("checkoutPincode").value.trim();


    if (
        !name ||
        !phone ||
        !address ||
        !city ||
        !pincode
    ) {

        showToast(
            "Please complete delivery information."
        );

        return;
    }

    if (!/^[0-9+()\-\s]{10,15}$/.test(phone)) {
        showToast("Please enter a valid mobile number.");
        return;
    }

    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
        showToast("Please enter a valid email address.");
        return;
    }


    const payment =
        document.querySelector(
            'input[name="payment"]:checked'
        )?.value || "UPI";


    if (
        payment === "COD" &&
        !settings.cod
    ) {

        showToast(
            "COD is currently disabled."
        );

        return;
    }


    const totals =
        calculateCart();


    const orderId =
        generateOrderId();


    const orderItems =
        cart.map(item => ({

            productId:
                item.productId,

            name:
                item.name,

            brand:
                products.find(product => product.id === item.productId)?.brand || "MM ATTAR",

            category:
                item.category,

            size:
                item.size,

            quantity:
                Number(item.quantity),

            price:
                Number(item.price),

            total:
                Number(item.price) *
                Number(item.quantity)

        }));


    const order = {

        orderId,

        userId:
            currentUser.uid,

        customer: {

            name,

            phone,

            email,

            address,

            area,

            city,

            state: "Gujarat",

            pincode

        },

        items:
            orderItems,

        subtotal:
            totals.subtotal,

        delivery:
            totals.delivery,

        discount:
            totals.discount,

        total:
            totals.total,

        paymentMethod:
            payment,

        paymentStatus:
            payment === "COD"
                ? "Pending"
                : "Pending Verification",

        orderStatus:
            "Order Received",

        createdAt:
            Date.now()

    };


    try {

        /*
          NOTE:
          Production system me stock validation/decrement
          server-side transaction/Cloud Function se karna
          chahiye. Yeh starter client-side implementation hai.
        */


        await set(
            ref(
                db,
                "orders/" + orderId
            ),
            order
        );


        /*
          Update stock
        */

        for (const item of cart) {

            const product =
                products.find(
                    p =>
                        p.id === item.productId
                );


            if (!product)
                continue;


            const newStock =
                Math.max(
                    0,
                    Number(product.stock || 0) -
                    Number(item.quantity)
                );


            await update(
                ref(
                    db,
                    "products/" +
                    product.id
                ),
                {
                    stock: newStock
                }
            );


            product.stock =
                newStock;

        }


        /*
          Save customer address
        */

        await update(
            ref(
                db,
                "users/" +
                currentUser.uid
            ),
            {

                name,

                phone,

                email,

                address: {

                    address,

                    area,

                    city,

                    state: "Gujarat",

                    pincode

                }

            }
        );


        /*
          Clear cart
        */

        cart = [];

        saveCart();


        /*
          Success page
        */

        showOrderSuccess(order);


        /*
          WhatsApp
        */

        prepareWhatsAppOrder(order);


    }

    catch (error) {

        console.error(error);

        showToast(
            "Could not place order. Please try again."
        );

    }

}


window.placeOrder =
    placeOrder;


/* =====================================================
   ORDER SUCCESS
===================================================== */

function showOrderSuccess(order) {

    showPage("orderSuccess");


    $("successOrderId")
        .textContent =
        order.orderId;


    $("successOrderDetails")
        .innerHTML = `

            <p>
                <strong>
                    Customer:
                </strong>
                ${escapeHTML(
                    order.customer.name
                )}
            </p>

            <p>
                <strong>
                    Total:
                </strong>
                ${money(order.total)}
            </p>

            <p>
                <strong>
                    Payment:
                </strong>
                ${escapeHTML(
                    order.paymentMethod
                )}
            </p>

            <p>
                <strong>
                    Status:
                </strong>
                <span class="order-status">
                    ${escapeHTML(
                        order.orderStatus
                    )}
                </span>
            </p>

        `;

}


function prepareWhatsAppOrder(order) {

    const items =
        order.items
            .map(
                item =>
                    `${item.name} | Brand: ${item.brand || "MM ATTAR"} | Size: ${item.size} | Quantity: ${item.quantity} | Price: ${money(item.price)} | Total: ${money(item.price * item.quantity)}`
            )
            .join("\n");


    const message =
`New MM ATTAR Order

Order ID: ${order.orderId}

Customer Name:
${order.customer.name}

Mobile:
${order.customer.phone}

Address:
${order.customer.address}, ${order.customer.area}, ${order.customer.city}, Gujarat - ${order.customer.pincode}

Products:
${items}

Total:
${money(order.total)}

Payment Method:
${order.paymentMethod}

Payment Status:
${order.paymentStatus}`;


    const phone =
        String(
            settings.whatsapp ||
            "6351476671"
        )
        .replace(/\D/g,"");


    $("whatsappOrderBtn").href =
        `https://wa.me/91${phone}?text=` +
        encodeURIComponent(message);

}


/* =====================================================
   ACCOUNT TABS
===================================================== */

function accountTab(
    tab,
    button
) {

    document
        .querySelectorAll(".account-tab")
        .forEach(el =>
            el.classList.add("hidden")
        );


    document
        .querySelectorAll(".account-menu button")
        .forEach(el =>
            el.classList.remove("active")
        );


    $(tab + "Tab")
        .classList.remove("hidden");


    button.classList.add("active");


    if (tab === "orders")
        loadMyOrders();


    if (tab === "addresses")
        loadSavedAddress();

    if (tab === "wishlist")
        renderWishlist();

}


window.accountTab =
    accountTab;


/* =====================================================
   MY ORDERS
===================================================== */

async function loadMyOrders() {

    if (!currentUser)
        return;


    const container =
        $("myOrders");


    container.innerHTML =
        "<p>Loading orders...</p>";


    try {

        const snapshot =
            await get(
                ref(db, "orders")
            );


        if (!snapshot.exists()) {

            container.innerHTML =
                "<p>No orders yet.</p>";

            return;
        }


        const data =
            snapshot.val();


        const orders =
            Object.values(data)
                .filter(
                    order =>
                        order.userId ===
                        currentUser.uid
                )
                .sort(
                    (a,b) =>
                        b.createdAt -
                        a.createdAt
                );


        if (!orders.length) {

            container.innerHTML =
                "<p>No orders yet.</p>";

            return;
        }


        container.innerHTML =
            orders.map(
                order => `

                    <div class="order-card">

                        <h3>
                            ${escapeHTML(
                                order.orderId
                            )}
                        </h3>

                        <p>
                            ${new Date(
                                order.createdAt
                            ).toLocaleString("en-IN")}
                        </p>

                        <p>
                            Total:
                            <strong>
                                ${money(order.total)}
                            </strong>
                        </p>

                        <p>
                            Payment:
                            ${escapeHTML(
                                order.paymentMethod
                            )}
                        </p>

                        <p>
                            Status:
                            <span class="order-status">
                                ${escapeHTML(
                                    order.orderStatus
                                )}
                            </span>
                        </p>

                    </div>

                `
            ).join("");

    }

    catch {

        container.innerHTML =
            "<p>Could not load orders.</p>";

    }

}


function loadSavedAddress() {

    get(
        ref(
            db,
            "users/" +
            currentUser.uid
        )
    )
    .then(snapshot => {

        if (
            snapshot.exists() &&
            snapshot.val().address
        ) {

            const a =
                snapshot.val().address;


            $("savedAddress")
                .innerHTML = `

                    <div class="order-card">

                        ${escapeHTML(a.address)}

                        <br>

                        ${escapeHTML(a.area)}

                        <br>

                        ${escapeHTML(a.city)},
                        Gujarat -
                        ${escapeHTML(a.pincode)}

                    </div>

                `;

        }

    });

}


/* =====================================================
   PAGE SYSTEM
===================================================== */

const pageIds = {

    home:
        "homePage",

    products:
        "productsPage",

    productDetails:
        "productDetailsPage",

    cart:
        "cartPage",

    checkout:
        "checkoutPage",

    orderSuccess:
        "orderSuccessPage",

    account:
        "accountPage",

    about:
        "aboutPage",

    contact:
        "contactPage",

    admin:
        "adminPage",

    brand:
        "brandPage"

};


function showPage(page) {

    if (page === "account" && !currentUser) {

        pendingNavigation = "account";
        sessionStorage.setItem("mmAttarPendingNavigation", pendingNavigation);

        showToast(
            "Account dekhne ke liye pehle login karein."
        );

        $("authSection")
            .classList.remove("hidden");

        $("mainWebsite")
            .classList.add("hidden");

        showLogin();

        return;
    }

    Object.values(pageIds)
        .forEach(id => {

            $(id)
                ?.classList
                .add("hidden");

        });


    const id =
        pageIds[page];


    if (id)
        $(id)
            .classList
            .remove("hidden");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (page === "cart")
        renderCart();


    if (page === "checkout")
        renderCheckout();


    if (page === "account")
        loadUserProfile();


    if (page === "admin")
        loadAdminDashboard();

}


window.showPage = showPage;


/* =====================================================
   MOBILE MENU
===================================================== */

function toggleMobileMenu() {

    $("mobileMenu")
        .classList
        .toggle("active");

}


window.toggleMobileMenu =
    toggleMobileMenu;


/* =====================================================
   SETTINGS
===================================================== */

async function loadSettings() {

    try {

        const snapshot =
            await get(
                ref(db, "settings")
            );


        if (snapshot.exists()) {

            settings = {
                ...settings,
                ...snapshot.val()
            };

            if (Number(settings.delivery) <= 0) {
                settings.delivery = 50;
            }

        }

    }

    catch (error) {

        console.warn(error);

    }


    if ($("settingBusinessName")) {

        $("settingBusinessName").value =
            settings.businessName || "";

        $("settingWhatsapp").value =
            settings.whatsapp || "";

        $("settingInstagram").value =
            settings.instagram || "";

        $("settingEmail").value =
            settings.email || "";

        $("settingUpi").value =
            settings.upi || "";

        $("settingAddress").value =
            settings.address || "";

        $("settingDelivery").value =
            settings.delivery || 0;

        $("settingCod").checked =
            settings.cod !== false;

    }

}


/* =====================================================
   ADMIN SECURITY
===================================================== */

/*
 IMPORTANT:

 Firebase database me:

 admins/
    ADMIN_UID/
        true

aisa set karo.

Frontend me email ko admin security ka
final source mat samjho.
Firebase Rules me bhi admin UID validate karo.
*/


let isAdmin = false;


async function checkAdmin(uid) {

    try {

        const snapshot =
            await get(
                ref(
                    db,
                    "admins/" + uid
                )
            );


        isAdmin =
            snapshot.exists() &&
            snapshot.val() === true;


    }

    catch {

        isAdmin = false;

    }

}


/* =====================================================
   ADMIN DASHBOARD
===================================================== */

async function loadAdminDashboard() {

    if (!isAdmin) {

        showToast(
            "Admin access required."
        );

        showPage("home");

        return;
    }


    await loadProducts();

    renderAdminProducts();

    renderAdminBrands();

    renderAdminOrders();

    renderAdminCustomers();

    loadAdminStats();

    loadSettings();

}


window.loadAdminDashboard =
    loadAdminDashboard;


/* =====================================================
   ADMIN TAB
===================================================== */

function adminTab(
    tab,
    button
) {

    document
        .querySelectorAll(".admin-tab")
        .forEach(el =>
            el.classList.add("hidden")
        );


    document
        .querySelectorAll(".admin-tabs button")
        .forEach(el =>
            el.classList.remove("active")
        );


    $(tab)
        .classList
        .remove("hidden");


    button.classList.add("active");


    if (tab === "adminOrdersTab")
        renderAdminOrders();


    if (tab === "adminProductsTab")
        renderAdminProducts();

    if (tab === "adminBrandsTab")
        renderAdminBrands();


    if (tab === "adminCustomersTab")
        renderAdminCustomers();


    if (tab === "adminSettingsTab")
        loadSettings();

}


window.adminTab =
    adminTab;


function renderAdminBrands() {

    const container = $("adminBrandsList");
    if (!container) return;

    container.innerHTML = brands.map(brand => `
        <div class="admin-product-row">
            <div class="admin-product-main">
                <img src="${escapeHTML(brand.logo || "./Multi-artwork-1.png")}" alt="${escapeHTML(brand.name)} logo">
                <div>
                    <strong>${escapeHTML(brand.name)}</strong>
                    <small>${brand.enabled === false ? "Inactive" : "Active"}</small>
                </div>
            </div>
            <div class="admin-product-actions">
                <button class="outline-btn" onclick="editBrand('${escapeHTML(brand.id)}')">Edit</button>
                <button class="outline-btn" onclick="toggleBrand('${escapeHTML(brand.id)}')">${brand.enabled === false ? "Activate" : "Deactivate"}</button>
                <button class="remove-btn" onclick="deleteBrand('${escapeHTML(brand.id)}')">Delete</button>
            </div>
        </div>
    `).join("");

}


function clearBrandForm() {

    ["brandEditId", "brandName", "brandLogo", "brandBanner", "brandDescription"]
        .forEach(id => $(id).value = "");
    $("brandEnabled").checked = true;

}


function editBrand(brandId) {

    const brand = brands.find(item => item.id === brandId);
    if (!brand) return;

    $("brandEditId").value = brand.id;
    $("brandName").value = brand.name || "";
    $("brandLogo").value = brand.logo || "";
    $("brandBanner").value = brand.banner || "";
    $("brandDescription").value = brand.description || "";
    $("brandEnabled").checked = brand.enabled !== false;

}


async function saveBrand() {

    if (!isAdmin) {
        showToast("Admin access required.");
        return;
    }

    const name = $("brandName").value.trim();
    if (!name) {
        showToast("Enter a brand name.");
        return;
    }

    const existingId = $("brandEditId").value.trim();
    const id = existingId || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const brand = {
        name,
        logo: $("brandLogo").value.trim(),
        banner: $("brandBanner").value.trim(),
        description: $("brandDescription").value.trim(),
        enabled: $("brandEnabled").checked,
        updatedAt: Date.now()
    };

    try {
        await set(ref(db, `brands/${id}`), brand);
        brands = [...brands.filter(item => item.id !== id), { id, ...brand }];
        brands.sort((left, right) => left.name.localeCompare(right.name));
        renderAdminBrands();
        renderBrandCards();
        clearBrandForm();
        showToast("Brand saved.");
    }
    catch (error) {
        console.error(error);
        showToast("Could not save brand. Check Firebase permissions.");
    }

}


async function toggleBrand(brandId) {

    const brand = brands.find(item => item.id === brandId);
    if (!brand || !isAdmin) return;

    try {
        brand.enabled = brand.enabled === false;
        await update(ref(db, `brands/${brandId}`), { enabled: brand.enabled });
        renderAdminBrands();
        renderBrandCards();
        showToast("Brand status updated.");
    }
    catch {
        showToast("Could not update brand status.");
    }

}


async function deleteBrand(brandId) {

    if (!isAdmin || !confirm("Delete this brand? Existing products will remain unchanged.")) return;

    try {
        await remove(ref(db, `brands/${brandId}`));
        brands = brands.filter(item => item.id !== brandId);
        renderAdminBrands();
        renderBrandCards();
        showToast("Brand deleted.");
    }
    catch {
        showToast("Could not delete brand.");
    }

}


window.saveBrand = saveBrand;
window.clearBrandForm = clearBrandForm;
window.editBrand = editBrand;
window.toggleBrand = toggleBrand;
window.deleteBrand = deleteBrand;


/* =====================================================
   ADMIN STATS
===================================================== */

async function loadAdminStats() {

    if (!isAdmin)
        return;


    try {

        const snapshot =
            await get(
                ref(db, "orders")
            );


        const orders =
            snapshot.exists()
                ? Object.values(snapshot.val())
                : [];


        const today =
            new Date()
                .toISOString()
                .slice(0,10);


        const todayOrders =
            orders.filter(
                order =>
                    new Date(order.createdAt)
                        .toISOString()
                        .slice(0,10)
                    === today
            );


        const sales =
            orders.reduce(
                (sum,order) =>
                    sum +
                    Number(order.total || 0),
                0
            );


        const customerIds =
            new Set(
                orders.map(
                    order => order.userId
                )
            );


        $("adminOrders").textContent =
            orders.length;

        $("adminTodayOrders").textContent =
            todayOrders.length;

        $("adminSales").textContent =
            money(sales);

        $("adminCustomers").textContent =
            customerIds.size;

        $("adminAttar").textContent =
            products.filter(
                p => p.category === "attar"
            ).length;

        $("adminPerfume").textContent =
            products.filter(
                p => p.category === "perfume"
            ).length;

    }

    catch(error) {

        console.error(error);

    }

}


/* =====================================================
   ADMIN ORDERS
===================================================== */

async function renderAdminOrders() {

    if (!isAdmin)
        return;


    const container =
        $("adminOrdersList");


    try {

        const snapshot =
            await get(
                ref(db, "orders")
            );


        if (!snapshot.exists()) {

            container.innerHTML =
                "<p>No orders found.</p>";

            return;
        }


        let orders =
            Object.values(snapshot.val())
                .sort(
                    (a,b) =>
                        b.createdAt -
                        a.createdAt
                );


        const search =
            (
                $("adminOrderSearch")
                    ?.value || ""
            )
            .toLowerCase();


        if (search) {

            orders =
                orders.filter(order =>

                    order.orderId
                        .toLowerCase()
                        .includes(search) ||

                    order.customer.name
                        .toLowerCase()
                        .includes(search) ||

                    order.customer.phone
                        .includes(search)

                );

        }


        container.innerHTML = `

            <table class="admin-table">

                <thead>

                    <tr>

                        <th>Order</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        orders.map(
                            order => `

                                <tr>

                                    <td>
                                        <strong>
                                            ${escapeHTML(
                                                order.orderId
                                            )}
                                        </strong>

                                        <br>

                                        <small>
                                            ${new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-IN")}
                                        </small>

                                    </td>


                                    <td>

                                        ${escapeHTML(
                                            order.customer.name
                                        )}

                                        <br>

                                        ${escapeHTML(
                                            order.customer.phone
                                        )}

                                    </td>


                                    <td>

                                        ${
                                            order.items
                                                .map(
                                                    item =>
                                                        `${escapeHTML(item.name)}
                                                        (${escapeHTML(item.size)})
                                                        ×${item.quantity}`
                                                )
                                                .join("<br>")
                                        }

                                    </td>


                                    <td>
                                        ${money(order.total)}
                                    </td>


                                    <td>

                                        ${escapeHTML(
                                            order.paymentMethod
                                        )}

                                        <br>

                                        <small>
                                            ${escapeHTML(
                                                order.paymentStatus
                                            )}
                                        </small>

                                    </td>


                                    <td>

                                        <select
                                            class="status-select"
                                            onchange="
                                                updateOrderStatus(
                                                    '${order.orderId}',
                                                    this.value
                                                )
                                            ">

                                            ${
                                                [
                                                    "Order Received",
                                                    "Confirmed",
                                                    "Processing",
                                                    "Packed",
                                                    "Shipped",
                                                    "Out for Delivery",
                                                    "Delivered",
                                                    "Cancelled"
                                                ]
                                                .map(
                                                    status =>
                                                        `
                                                        <option
                                                            value="${status}"
                                                            ${
                                                                order.orderStatus === status
                                                                    ? "selected"
                                                                    : ""
                                                            }>
                                                            ${status}
                                                        </option>
                                                        `
                                                )
                                                .join("")
                                            }

                                        </select>

                                    </td>


                                    <td>

                                        <button
                                            class="admin-action"
                                            onclick="
                                                viewAdminOrder(
                                                    '${order.orderId}'
                                                )
                                            ">

                                            View

                                        </button>

                                    </td>

                                </tr>

                            `
                        ).join("")
                    }

                </tbody>

            </table>

        `;

    }

    catch(error) {

        console.error(error);

        container.innerHTML =
            "<p>Could not load orders.</p>";

    }

}


window.renderAdminOrders =
    renderAdminOrders;


/* =====================================================
   UPDATE ORDER STATUS
===================================================== */

async function updateOrderStatus(
    orderId,
    status
) {

    if (!isAdmin)
        return;


    try {

        await update(
            ref(
                db,
                "orders/" +
                orderId
            ),
            {
                orderStatus: status,

                updatedAt: Date.now()
            }
        );


        showToast(
            "Order status updated."
        );


    }

    catch {

        showToast(
            "Could not update status."
        );

    }

}


window.updateOrderStatus =
    updateOrderStatus;


/* =====================================================
   VIEW ORDER
===================================================== */

async function viewAdminOrder(orderId) {

    const snapshot =
        await get(
            ref(
                db,
                "orders/" +
                orderId
            )
        );


    if (!snapshot.exists())
        return;


    const order =
        snapshot.val();


    alert(
`
MM ATTAR ORDER

Order ID:
${order.orderId}

Customer:
${order.customer.name}

Mobile:
${order.customer.phone}

Email:
${order.customer.email}

Address:
${order.customer.address},
${order.customer.area},
${order.customer.city},
Gujarat -
${order.customer.pincode}

Products:
${order.items
    .map(
        item =>
            `${item.name} - ${item.size} × ${item.quantity}`
    )
    .join("\n")}

Total:
${money(order.total)}

Payment:
${order.paymentMethod}

Payment Status:
${order.paymentStatus}

Order Status:
${order.orderStatus}
`
    );

}


window.viewAdminOrder =
    viewAdminOrder;


/* =====================================================
   ADMIN PRODUCTS
===================================================== */

function renderAdminProducts() {

    if (!isAdmin)
        return;


    const container =
        $("adminProductsList");


    container.innerHTML = `

        <table class="admin-table">

            <thead>

                <tr>

                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Prices</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>

                </tr>

            </thead>

            <tbody>

                ${
                    products.map(
                        product => `

                            <tr>

                                <td>

                                    <img
                                        src="${escapeHTML(product.images?.[0] || product.image)}"
                                        style="
                                            width:50px;
                                            height:50px;
                                            object-fit:cover;
                                            border-radius:5px;
                                        "
                                    >

                                </td>


                                <td>
                                    <strong>
                                        ${escapeHTML(
                                            product.name
                                        )}
                                    </strong>
                                </td>


                                <td>
                                    ${escapeHTML(
                                        product.category
                                    )}
                                </td>


                                <td>

                                    ${
                                        (product.sizes || [])
                                            .map(
                                                size =>
                                                    `${escapeHTML(size.name)}:
                                                    ${money(size.price)}`
                                            )
                                            .join("<br>")
                                    }

                                </td>


                                <td>

                                    <input
                                        type="number"
                                        value="${Number(product.stock || 0)}"
                                        min="0"
                                        style="
                                            width:70px;
                                            padding:5px;
                                        "
                                        onchange="
                                            updateProductStock(
                                                '${product.id}',
                                                this.value
                                            )
                                        "
                                    >

                                </td>


                                <td>

                                    ${
                                        product.enabled !== false
                                            ? "Enabled"
                                            : "Disabled"
                                    }

                                </td>


                                <td>

                                    <button
                                        class="admin-action"
                                        onclick="
                                            editProduct(
                                                '${product.id}'
                                            )
                                        ">
                                        Edit
                                    </button>


                                    <button
                                        class="admin-action"
                                        onclick="
                                            deleteProduct(
                                                '${product.id}'
                                            )
                                        ">
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        `
                    ).join("")
                }

            </tbody>

        </table>

    `;

}


async function updateProductStock(
    productId,
    stock
) {

    if (!isAdmin)
        return;


    const value =
        Math.max(
            0,
            Number(stock || 0)
        );


    await update(
        ref(
            db,
            "products/" +
            productId
        ),
        {
            stock: value
        }
    );


    const product =
        products.find(
            p => p.id === productId
        );


    if (product)
        product.stock = value;


    showToast("Stock updated.");

}


window.updateProductStock =
    updateProductStock;


/* =====================================================
   PRODUCT FORM
===================================================== */

function openProductForm(product = null) {

    if (!isAdmin)
        return;


    $("productModal")
        .classList
        .remove("hidden");


    $("editProductId").value =
        product?.id || "";


    $("productFormTitle")
        .textContent =
        product
            ? "Edit Product"
            : "Add Product";


    $("productName").value =
        product?.name || "";

    $("productCategory").value =
        product?.category || "attar";

    $("productBrand").value =
        product?.brand || "MM ATTAR";

    $("productImage").value =
        product?.image || "";

    $("productImageGallery").value =
        (product?.images || []).filter(image => image !== product?.image).join("\n");

    $("productImageFiles").value = "";

    $("productDescription").value =
        product?.description || "";

    $("productNotes").value =
        product?.notes || "";

    $("productStock").value =
        product?.stock ?? 10;

    $("productRating").value =
        product?.rating ?? 4.8;

    $("productFeatured").checked =
        product?.featured === true;

    $("productEnabled").checked =
        product?.enabled !== false;


    const sizes =
        product?.sizes ||
        [
            {
                name:"6ML",
                price:""
            },
            {
                name:"12ML",
                price:""
            },
            {
                name:"25ML",
                price:""
            }
        ];


    $("productSizes").innerHTML =
        sizes.map(
            size => `

                <div class="size-row">

                    <input
                        class="size-name"
                        value="${escapeHTML(size.name)}"
                        placeholder="Size">

                    <input
                        class="size-price"
                        type="number"
                        value="${size.price}"
                        placeholder="Price">

                </div>

            `
        ).join("");

}


window.openProductForm =
    openProductForm;


/* =====================================================
   CLOSE PRODUCT FORM
===================================================== */

function closeProductForm() {

    $("productModal")
        .classList
        .add("hidden");

}


window.closeProductForm =
    closeProductForm;


/* =====================================================
   SAVE PRODUCT
===================================================== */

async function saveProduct() {

    if (!isAdmin)
        return;


    const id =
        $("editProductId").value.trim();


    const name =
        $("productName")
            .value
            .trim();


    const category =
        $("productCategory").value;


    const brand =
        $("productBrand")
            .value
            .trim();


    const image =
        $("productImage")
            .value
            .trim();

    const galleryUrls =
        $("productImageGallery")
            .value
            .split("\n")
            .map(value => value.trim())
            .filter(Boolean);


    const description =
        $("productDescription")
            .value
            .trim();


    const notes =
        $("productNotes")
            .value
            .trim();


    const stock =
        Number(
            $("productStock").value || 0
        );

    const rating = Math.min(5, Math.max(0, Number($("productRating").value || 0)));
    const featured = $("productFeatured").checked;
    const enabled = $("productEnabled").checked;


    if (!name) {

        showToast(
            "Product name required."
        );

        return;
    }


    const sizeNames =
        document.querySelectorAll(
            ".size-name"
        );


    const sizePrices =
        document.querySelectorAll(
            ".size-price"
        );


    const sizes = [];


    for (
        let i = 0;
        i < sizeNames.length;
        i++
    ) {

        const sizeName =
            sizeNames[i]
                .value
                .trim();


        const price =
            Number(
                sizePrices[i].value || 0
            );


        if (
            sizeName &&
            price > 0
        ) {

            sizes.push({

                name: sizeName,

                price

            });

        }

    }


    if (!sizes.length) {

        showToast(
            "Add at least one size and price."
        );

        return;
    }


    const productId =
        id ||
        (
            category +
            "-" +
            name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g,"-") +
            "-" +
            Date.now()
        );


    let uploadedImages = [];

    try {
        const files = [...($("productImageFiles").files || [])];
        uploadedImages = await Promise.all(files.map(async file => {
            const filePath = `products/${productId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
            const uploaded = await uploadBytes(storageRef(storage, filePath), file);
            return getDownloadURL(uploaded.ref);
        }));
    }
    catch (error) {
        console.error(error);
        showToast("Image upload failed. Check Firebase Storage permissions.");
        return;
    }

    const images = [image, ...galleryUrls, ...uploadedImages].filter(Boolean);

    const product = {

        id: productId,

        name,

        category,

        brand,

        image:
            images[0] ||
            "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",

        images,

        description,

        notes,

        sizes,

        stock,

        rating,

        featured,

        enabled,

        updatedAt: Date.now()

    };


    try {

        await set(
            ref(
                db,
                "products/" +
                productId
            ),
            product
        );


        const index =
            products.findIndex(
                p =>
                    p.id === productId
            );


        if (index >= 0)
            products[index] = product;

        else
            products.push(product);


        closeProductForm();

        renderAdminProducts();

        renderFeaturedProducts();

        showToast(
            "Product saved successfully."
        );

    }

    catch(error) {

        console.error(error);

        showToast(
            "Could not save product."
        );

    }

}


window.saveProduct =
    saveProduct;


/* =====================================================
   EDIT PRODUCT
===================================================== */

function editProduct(productId) {

    const product =
        products.find(
            p => p.id === productId
        );


    if (product)
        openProductForm(product);

}


window.editProduct =
    editProduct;


/* =====================================================
   DELETE PRODUCT
===================================================== */

async function deleteProduct(productId) {

    if (!isAdmin)
        return;


    const confirmDelete =
        confirm(
            "Delete this product?"
        );


    if (!confirmDelete)
        return;


    try {

        await remove(
            ref(
                db,
                "products/" +
                productId
            )
        );


        products =
            products.filter(
                p =>
                    p.id !== productId
            );


        renderAdminProducts();

        renderFeaturedProducts();

        showToast(
            "Product deleted."
        );

    }

    catch {

        showToast(
            "Could not delete product."
        );

    }

}


window.deleteProduct =
    deleteProduct;


/* =====================================================
   ADMIN CUSTOMERS
===================================================== */

async function renderAdminCustomers() {

    if (!isAdmin)
        return;


    const container =
        $("adminCustomersList");


    try {

        const snapshot =
            await get(
                ref(db, "users")
            );


        if (!snapshot.exists()) {

            container.innerHTML =
                "<p>No customers found.</p>";

            return;
        }


        const users =
            Object.values(
                snapshot.val()
            );


        container.innerHTML = `

            <table class="admin-table">

                <thead>

                    <tr>

                        <th>Name</th>
                        <th>Mobile</th>
                        <th>Email</th>
                        <th>Registration</th>

                    </tr>

                </thead>

                <tbody>

                    ${
                        users.map(
                            user => `

                                <tr>

                                    <td>
                                        ${escapeHTML(
                                            user.name || "-"
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            user.phone || "-"
                                        )}
                                    </td>

                                    <td>
                                        ${escapeHTML(
                                            user.email || "-"
                                        )}
                                    </td>

                                    <td>
                                        ${
                                            user.createdAt
                                                ? new Date(
                                                    user.createdAt
                                                ).toLocaleDateString(
                                                    "en-IN"
                                                )
                                                : "-"
                                        }
                                    </td>

                                </tr>

                            `
                        ).join("")
                    }

                </tbody>

            </table>

        `;

    }

    catch(error) {

        console.error(error);

    }

}


window.renderAdminCustomers =
    renderAdminCustomers;


/* =====================================================
   SAVE SETTINGS
===================================================== */

async function saveSettings() {

    if (!isAdmin)
        return;


    settings = {

        businessName:
            $("settingBusinessName").value.trim(),

        whatsapp:
            $("settingWhatsapp").value.trim(),

        instagram:
            $("settingInstagram").value.trim(),

        email:
            $("settingEmail").value.trim(),

        upi:
            $("settingUpi").value.trim(),

        address:
            $("settingAddress").value.trim(),

        delivery:
            Number(
                $("settingDelivery").value || 0
            ),

        cod:
            $("settingCod").checked

    };


    try {

        await set(
            ref(db, "settings"),
            settings
        );


        showToast(
            "Settings saved successfully."
        );


    }

    catch {

        showToast(
            "Could not save settings."
        );

    }

}


window.saveSettings =
    saveSettings;


/* =====================================================
   OPEN ADMIN
===================================================== */

window.openAdmin =
    function() {

        if (!isAdmin) {

            showToast(
                "You are not an admin."
            );

            return;
        }


        showPage("admin");

    };


/* =====================================================
   OPTIONAL ADMIN KEYBOARD
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.shiftKey &&
            event.key.toLowerCase() === "a"
        ) {

            if (isAdmin)
                showPage("admin");

        }

    }
);


/* =====================================================
   INITIAL LOCAL SETTINGS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(
            () => {

                $("loader")
                    ?.classList
                    .add("hidden");

            },
            1500
        );

    }
);