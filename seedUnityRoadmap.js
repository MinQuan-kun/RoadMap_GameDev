import { MongoClient, ObjectId } from 'mongodb';

/**
 * Seed script: Tạo cấu trúc Roadmap Unity Developer với 5 Module lớn.
 * 
 * Unity Developer (root)
 * ├── Programming (C#)
 * ├── Engine (Unity)
 * ├── Math & Logic
 * ├── Gameplay Systems
 * └── Advanced
 */

async function seedModularRoadmap() {
  const uri = "mongodb+srv://minquan2705_db_user:M6P6R9smFVZIJPTj@gamedevroadmap.ppwnn7x.mongodb.net/?appName=GameDevRoadMap";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("GameDevRoadmapDB");
    const nodesCol = db.collection("Nodes");
    const roadmapsCol = db.collection("Roadmaps");

    console.log("🔗 Connected to MongoDB...");

    // ─── Xoá data cũ ──────────────────────────
    await nodesCol.deleteMany({ engine: "Unity" });
    await roadmapsCol.deleteMany({ engine: "Unity" });
    console.log("🗑️  Cleared old Unity data.");

    // ─── IDs ───────────────────────────────────
    const ROOT = new ObjectId();

    // 5 Module lớn
    const MOD_PROG   = new ObjectId();
    const MOD_ENGINE  = new ObjectId();
    const MOD_MATH    = new ObjectId();
    const MOD_GAMEPLAY = new ObjectId();
    const MOD_ADV     = new ObjectId();

    // Sub-nodes cho từng module
    const ids = {
      // Programming (C#)
      csBasic: new ObjectId(),
      csOOP: new ObjectId(),
      csAdvanced: new ObjectId(),
      variables: new ObjectId(),
      ifElse: new ObjectId(),
      loops: new ObjectId(),
      methods: new ObjectId(),
      arrayList: new ObjectId(),
      classObj: new ObjectId(),
      inheritance: new ObjectId(),
      polymorphism: new ObjectId(),
      encapsulation: new ObjectId(),
      interfaceEnum: new ObjectId(),
      delegateEvent: new ObjectId(),
      coroutine: new ObjectId(),
      linq: new ObjectId(),

      // Engine (Unity)
      unityInterface: new ObjectId(),
      lifecycle: new ObjectId(),
      sceneGameObj: new ObjectId(),
      componentTransform: new ObjectId(),
      prefabInspector: new ObjectId(),
      hierarchy: new ObjectId(),
      awakeStart: new ObjectId(),
      updateFixed: new ObjectId(),
      enableDisable: new ObjectId(),
      inputSystem: new ObjectId(),

      // Math & Logic
      linearAlgebra: new ObjectId(),
      vector: new ObjectId(),
      matrix: new ObjectId(),
      quaternion: new ObjectId(),
      trigonometry: new ObjectId(),
      interpolation: new ObjectId(),

      // Gameplay Systems
      movement: new ObjectId(),
      physics: new ObjectId(),
      animation: new ObjectId(),
      ui: new ObjectId(),
      audio: new ObjectId(),
      rigidbody: new ObjectId(),
      collider: new ObjectId(),
      raycast: new ObjectId(),
      animatorCtrl: new ObjectId(),
      blendTree: new ObjectId(),
      canvas: new ObjectId(),
      buttonSlider: new ObjectId(),
      audioSource: new ObjectId(),
      bgm: new ObjectId(),
      sfx: new ObjectId(),

      // Advanced
      codeArch: new ObjectId(),
      singleton: new ObjectId(),
      observer: new ObjectId(),
      scriptableObj: new ObjectId(),
      saveLoad: new ObjectId(),
      optimization: new ObjectId(),
      objectPooling: new ObjectId(),
      profiler: new ObjectId(),
      aiNav: new ObjectId(),
      navmesh: new ObjectId(),
      buildDeploy: new ObjectId(),
      buildPC: new ObjectId(),
      buildAndroid: new ObjectId(),
      networking: new ObjectId(),
    };

    // ─── Build Node Documents ──────────────────
    const allNodes = [
      // ROOT
      { _id: ROOT, name: "Unity Developer", engine: "Unity", category: "Root", parent_id: null,
        description: "Lộ trình học Unity từ Zero đến chuyên nghiệp" },

      // ═══════ MODULE 1: Programming (C#) ═══════
      { _id: MOD_PROG, name: "Programming (C#)", engine: "Unity", category: "Module", parent_id: ROOT,
        description: "Nền tảng ngôn ngữ C# từ cơ bản đến nâng cao" },

      { _id: ids.csBasic, name: "C# Cơ bản", engine: "Unity", category: "Language", parent_id: MOD_PROG,
        description: "Kiến thức nền tảng về C#: biến, toán tử, điều kiện, vòng lặp, hàm" },
      { _id: ids.csOOP, name: "C# OOP", engine: "Unity", category: "Language", parent_id: MOD_PROG,
        description: "Lập trình hướng đối tượng: Class, Object, kế thừa, đa hình" },
      { _id: ids.csAdvanced, name: "C# Nâng cao", engine: "Unity", category: "Language", parent_id: MOD_PROG,
        description: "Delegate, Event, Coroutine, LINQ và các kỹ thuật nâng cao" },

      // C# Cơ bản children
      { _id: ids.variables, name: "Biến & Toán tử", engine: "Unity", category: "Syntax", parent_id: ids.csBasic,
        description: "int, float, string, bool, toán tử số học và so sánh" },
      { _id: ids.ifElse, name: "Rẽ nhánh (if/else, switch)", engine: "Unity", category: "Logic", parent_id: ids.csBasic,
        description: "Cấu trúc điều kiện để kiểm soát luồng chương trình" },
      { _id: ids.loops, name: "Vòng lặp (for, while)", engine: "Unity", category: "Logic", parent_id: ids.csBasic,
        description: "Lặp lại khối lệnh nhiều lần với for, while, foreach" },
      { _id: ids.methods, name: "Hàm (Method)", engine: "Unity", category: "Logic", parent_id: ids.csBasic,
        description: "Tạo và gọi hàm, tham số, giá trị trả về" },
      { _id: ids.arrayList, name: "Array & List", engine: "Unity", category: "Data", parent_id: ids.csBasic,
        description: "Mảng, danh sách, truy xuất và duyệt phần tử" },

      // C# OOP children
      { _id: ids.classObj, name: "Class & Object", engine: "Unity", category: "OOP", parent_id: ids.csOOP,
        description: "Tạo class, khởi tạo object, constructor" },
      { _id: ids.inheritance, name: "Kế thừa (Inheritance)", engine: "Unity", category: "OOP", parent_id: ids.csOOP,
        description: "Tái sử dụng code qua kế thừa class" },
      { _id: ids.polymorphism, name: "Đa hình (Polymorphism)", engine: "Unity", category: "OOP", parent_id: ids.csOOP,
        description: "Override, virtual, abstract methods" },
      { _id: ids.encapsulation, name: "Đóng gói (Encapsulation)", engine: "Unity", category: "OOP", parent_id: ids.csOOP,
        description: "Access modifiers: public, private, protected" },
      { _id: ids.interfaceEnum, name: "Interface & Enum", engine: "Unity", category: "OOP", parent_id: ids.csOOP,
        description: "Định nghĩa giao diện và kiểu liệt kê" },

      // C# Nâng cao children
      { _id: ids.delegateEvent, name: "Delegate & Event", engine: "Unity", category: "Advanced", parent_id: ids.csAdvanced,
        description: "Callback, event-driven programming trong C#" },
      { _id: ids.coroutine, name: "Coroutine", engine: "Unity", category: "Advanced", parent_id: ids.csAdvanced,
        description: "IEnumerator, yield return, xử lý bất đồng bộ trong Unity" },
      { _id: ids.linq, name: "LINQ", engine: "Unity", category: "Advanced", parent_id: ids.csAdvanced,
        description: "Language Integrated Query cho xử lý dữ liệu" },

      // ═══════ MODULE 2: Engine (Unity) ═══════
      { _id: MOD_ENGINE, name: "Engine (Unity)", engine: "Unity", category: "Module", parent_id: ROOT,
        description: "Làm quen editor và vòng đời MonoBehaviour" },

      { _id: ids.unityInterface, name: "Unity Interface", engine: "Unity", category: "Engine", parent_id: MOD_ENGINE,
        description: "Scene, Hierarchy, Inspector, Project window" },
      { _id: ids.lifecycle, name: "MonoBehaviour Lifecycle", engine: "Unity", category: "Engine", parent_id: MOD_ENGINE,
        description: "Vòng đời script: Awake, Start, Update, FixedUpdate" },
      { _id: ids.inputSystem, name: "Input System", engine: "Unity", category: "Engine", parent_id: MOD_ENGINE,
        description: "Old Input Manager và New Input System" },

      // Unity Interface children
      { _id: ids.sceneGameObj, name: "Scene & GameObject", engine: "Unity", category: "Editor", parent_id: ids.unityInterface,
        description: "Quản lý scene, tạo và thao tác với GameObject" },
      { _id: ids.componentTransform, name: "Component & Transform", engine: "Unity", category: "Editor", parent_id: ids.unityInterface,
        description: "Attach component, position/rotation/scale" },
      { _id: ids.prefabInspector, name: "Prefab & Inspector", engine: "Unity", category: "Editor", parent_id: ids.unityInterface,
        description: "Tạo prefab, chỉnh thuộc tính qua Inspector" },
      { _id: ids.hierarchy, name: "Hierarchy & Project", engine: "Unity", category: "Editor", parent_id: ids.unityInterface,
        description: "Cấu trúc thư mục project và hierarchy" },

      // Lifecycle children
      { _id: ids.awakeStart, name: "Awake() & Start()", engine: "Unity", category: "Lifecycle", parent_id: ids.lifecycle,
        description: "Khởi tạo khi script được load và enable" },
      { _id: ids.updateFixed, name: "Update() & FixedUpdate()", engine: "Unity", category: "Lifecycle", parent_id: ids.lifecycle,
        description: "Vòng lặp game: render frame vs physics step" },
      { _id: ids.enableDisable, name: "OnEnable() & OnDisable()", engine: "Unity", category: "Lifecycle", parent_id: ids.lifecycle,
        description: "Xử lý khi script được bật/tắt" },

      // ═══════ MODULE 3: Math & Logic ═══════
      { _id: MOD_MATH, name: "Math & Logic", engine: "Unity", category: "Module", parent_id: ROOT,
        description: "Toán học cần thiết cho game development" },

      { _id: ids.linearAlgebra, name: "Đại số tuyến tính", engine: "Unity", category: "Math", parent_id: MOD_MATH,
        description: "Vector, Matrix — nền tảng toán 3D" },
      { _id: ids.quaternion, name: "Quaternion & Rotation", engine: "Unity", category: "Math", parent_id: MOD_MATH,
        description: "Xoay object tránh gimbal lock" },
      { _id: ids.trigonometry, name: "Lượng giác (Sin/Cos)", engine: "Unity", category: "Math", parent_id: MOD_MATH,
        description: "Ứng dụng sin, cos trong chuyển động và hiệu ứng" },
      { _id: ids.interpolation, name: "Lerp & Interpolation", engine: "Unity", category: "Math", parent_id: MOD_MATH,
        description: "Nội suy tuyến tính cho di chuyển mượt mà" },

      // Linear Algebra children
      { _id: ids.vector, name: "Vector2 / Vector3", engine: "Unity", category: "Math", parent_id: ids.linearAlgebra,
        description: "Vị trí, hướng, khoảng cách trong không gian 2D/3D" },
      { _id: ids.matrix, name: "Matrix (Ma trận)", engine: "Unity", category: "Math", parent_id: ids.linearAlgebra,
        description: "Phép biến đổi: dịch chuyển, xoay, co giãn" },

      // ═══════ MODULE 4: Gameplay Systems ═══════
      { _id: MOD_GAMEPLAY, name: "Gameplay Systems", engine: "Unity", category: "Module", parent_id: ROOT,
        description: "Hệ thống gameplay: vật lý, UI, animation, audio" },

      { _id: ids.movement, name: "Movement & Input", engine: "Unity", category: "Gameplay", parent_id: MOD_GAMEPLAY,
        description: "Di chuyển nhân vật và xử lý input" },
      { _id: ids.physics, name: "Physics", engine: "Unity", category: "Gameplay", parent_id: MOD_GAMEPLAY,
        description: "Rigidbody, Collider, va chạm, Raycast" },
      { _id: ids.animation, name: "Animation", engine: "Unity", category: "Gameplay", parent_id: MOD_GAMEPLAY,
        description: "Animator, Animation Clip, Blend Tree" },
      { _id: ids.ui, name: "UI (User Interface)", engine: "Unity", category: "Gameplay", parent_id: MOD_GAMEPLAY,
        description: "Canvas, TextMeshPro, Button, Slider" },
      { _id: ids.audio, name: "Audio", engine: "Unity", category: "Gameplay", parent_id: MOD_GAMEPLAY,
        description: "AudioSource, BGM, SFX, AudioListener" },

      // Movement children
      { _id: ids.rigidbody, name: "Rigidbody", engine: "Unity", category: "Physics", parent_id: ids.movement,
        description: "Physics-based movement: Velocity, AddForce" },

      // Physics children
      { _id: ids.collider, name: "Collider & Trigger", engine: "Unity", category: "Physics", parent_id: ids.physics,
        description: "Box, Sphere, Capsule Collider; isTrigger" },
      { _id: ids.raycast, name: "Raycast", engine: "Unity", category: "Physics", parent_id: ids.physics,
        description: "Bắn tia kiểm tra va chạm, click detection" },

      // Animation children
      { _id: ids.animatorCtrl, name: "Animator Controller", engine: "Unity", category: "Animation", parent_id: ids.animation,
        description: "State machine cho animation" },
      { _id: ids.blendTree, name: "Blend Tree", engine: "Unity", category: "Animation", parent_id: ids.animation,
        description: "Pha trộn nhiều animation theo parameter" },

      // UI children
      { _id: ids.canvas, name: "Canvas & TextMeshPro", engine: "Unity", category: "UI", parent_id: ids.ui,
        description: "Render UI, hiển thị text chất lượng cao" },
      { _id: ids.buttonSlider, name: "Button & Slider", engine: "Unity", category: "UI", parent_id: ids.ui,
        description: "Xử lý sự kiện click, kéo slider" },

      // Audio children
      { _id: ids.audioSource, name: "AudioSource", engine: "Unity", category: "Audio", parent_id: ids.audio,
        description: "Component phát âm thanh" },
      { _id: ids.bgm, name: "Background Music", engine: "Unity", category: "Audio", parent_id: ids.audio,
        description: "Nhạc nền loop liên tục" },
      { _id: ids.sfx, name: "Sound Effects", engine: "Unity", category: "Audio", parent_id: ids.audio,
        description: "Hiệu ứng âm thanh ngắn: nhảy, bắn, va chạm" },

      // ═══════ MODULE 5: Advanced ═══════
      { _id: MOD_ADV, name: "Advanced", engine: "Unity", category: "Module", parent_id: ROOT,
        description: "Kiến trúc code, tối ưu, AI, deploy và networking" },

      { _id: ids.codeArch, name: "Code Architecture", engine: "Unity", category: "Architecture", parent_id: MOD_ADV,
        description: "Design patterns cho code game sạch, mở rộng" },
      { _id: ids.saveLoad, name: "Save/Load", engine: "Unity", category: "Technical", parent_id: MOD_ADV,
        description: "Lưu và tải dữ liệu: PlayerPrefs, JSON, File" },
      { _id: ids.optimization, name: "Optimization", engine: "Unity", category: "Technical", parent_id: MOD_ADV,
        description: "Tối ưu hiệu năng game" },
      { _id: ids.aiNav, name: "AI & Navigation", engine: "Unity", category: "AI", parent_id: MOD_ADV,
        description: "AI cơ bản và NavMesh pathfinding" },
      { _id: ids.buildDeploy, name: "Build & Deploy", engine: "Unity", category: "Deploy", parent_id: MOD_ADV,
        description: "Đóng gói và phát hành game" },
      { _id: ids.networking, name: "Multiplayer", engine: "Unity", category: "Network", parent_id: MOD_ADV,
        description: "Networking cơ bản, Photon, Netcode" },

      // Architecture children
      { _id: ids.singleton, name: "Singleton Pattern", engine: "Unity", category: "Pattern", parent_id: ids.codeArch,
        description: "Quản lý instance duy nhất: GameManager, AudioManager" },
      { _id: ids.observer, name: "Observer / Event", engine: "Unity", category: "Pattern", parent_id: ids.codeArch,
        description: "Giao tiếp giữa các hệ thống qua event" },
      { _id: ids.scriptableObj, name: "ScriptableObject", engine: "Unity", category: "Data", parent_id: ids.codeArch,
        description: "Lưu trữ data dạng asset, tái sử dụng" },

      // Optimization children
      { _id: ids.objectPooling, name: "Object Pooling", engine: "Unity", category: "Performance", parent_id: ids.optimization,
        description: "Tái sử dụng object thay vì Instantiate/Destroy liên tục" },
      { _id: ids.profiler, name: "Profiler", engine: "Unity", category: "Performance", parent_id: ids.optimization,
        description: "Đo lường và phân tích hiệu năng game" },

      // AI children
      { _id: ids.navmesh, name: "NavMesh", engine: "Unity", category: "AI", parent_id: ids.aiNav,
        description: "Tự động tìm đường cho NPC" },

      // Build children
      { _id: ids.buildPC, name: "Build PC/Mac", engine: "Unity", category: "Deploy", parent_id: ids.buildDeploy,
        description: "Build standalone cho desktop" },
      { _id: ids.buildAndroid, name: "Build Android", engine: "Unity", category: "Deploy", parent_id: ids.buildDeploy,
        description: "Build APK/AAB cho Android" },
    ];

    // ─── Insert Nodes ──────────────────────────
    const result = await nodesCol.insertMany(allNodes);
    console.log(`✅ Inserted ${result.insertedCount} nodes.`);

    // ─── Create Roadmap Document ───────────────
    // nodes_layout includes ALL nodes so the API can find them
    const nodesLayout = allNodes.map(n => ({
      node_id: n._id,
      x: 0,
      y: 0,
    }));

    const roadmap = {
      title: "Unity Developer Roadmap",
      description: "Lộ trình học Unity toàn diện: 5 module từ Programming đến Advanced",
      engine: "Unity",
      difficulty: "All Levels",
      nodes_layout: nodesLayout,
      created_at: new Date(),
    };

    const rmResult = await roadmapsCol.insertOne(roadmap);
    console.log(`✅ Created roadmap with ID: ${rmResult.insertedId}`);
    console.log("\n📊 Module structure:");
    console.log("   Unity Developer (root)");
    console.log("   ├── Programming (C#)     — 3 topics, 13 sub-nodes");
    console.log("   ├── Engine (Unity)        — 3 topics, 7 sub-nodes");
    console.log("   ├── Math & Logic          — 4 topics, 2 sub-nodes");
    console.log("   ├── Gameplay Systems      — 5 topics, 8 sub-nodes");
    console.log("   └── Advanced              — 6 topics, 7 sub-nodes");

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await client.close();
    console.log("👋 Disconnected.");
  }
}

seedModularRoadmap();
