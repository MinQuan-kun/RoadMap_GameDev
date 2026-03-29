import { MongoClient, ObjectId } from 'mongodb';

async function seedQuiz() {
  const uri = "mongodb://localhost:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("GameDevRoadmapDB");
    const questions = db.collection("QuestionBank");

    await questions.deleteMany({});

    const q1_Level = new ObjectId("65f1b1b1b1b1b1b1b1b1b001");
    const q3_Engine = new ObjectId("65f1b1b1b1b1b1b1b1b1b003");
    const q6_UnityExp = new ObjectId("65f1b1b1b1b1b1b1b1b1b006");

    const quizData = [
      // --- CÂU HỎI CHUNG ---
      {
        _id: q1_Level,
        question_text: "Câu hỏi 1: Trình độ hiện tại của bạn là gì?",
        parent_question_id: null,
        required_option_text: null,
        options: [
          { text: "Beginner (chưa từng làm game)", mapping_nodes: ["69a6abc9e80a2d2c8f715a39"] }, // C# Basic
          { text: "Intermediate (đã biết lập trình hoặc có nền tảng)", mapping_nodes: ["69a6abcae80a2d2c8f715a4c"] }, // Unity Interface
          { text: "Advanced (đã làm game, muốn nâng cao hoặc đi làm)", mapping_nodes: ["69a6abcbe80a2d2c8f715a6c"] } // Architecture
        ]
      },
      {
        question_text: "Câu hỏi 2: Nền tảng lập trình của bạn?",
        parent_question_id: q1_Level,
        required_option_text: "Beginner (chưa từng làm game)",
        options: [
          { text: "Chưa biết lập trình", mapping_nodes: ["69a6abc9e80a2d2c8f715a39"] },
          { text: "Biết cơ bản (if, loop, function)", mapping_nodes: ["69a6abcae80a2d2c8f715a3b", "69a6abcae80a2d2c8f715a3c"] }, // Logic control
          { text: "Biết OOP hoặc đã làm project", mapping_nodes: ["69a6abcae80a2d2c8f715a3f"] } // C# OOP
        ]
      },
      {
        _id: q3_Engine,
        question_text: "Câu hỏi 3: Bạn muốn sử dụng Engine nào?",
        parent_question_id: null,
        required_option_text: null,
        options: [
          { text: "Unity", mapping_nodes: ["69a6abc9e80a2d2c8f715a38"] }, // Unity Root
          { text: "Unreal Engine 5", mapping_nodes: [] }, // Để trống theo yêu cầu
          { text: "Chưa biết, cần tư vấn", mapping_nodes: [] }
        ]
      },

      // --- NHÁNH TƯ VẤN (Nếu chọn 3C) ---
      {
        question_text: "Câu hỏi 4.1: Bạn thích cách làm việc nào?",
        parent_question_id: q3_Engine,
        required_option_text: "Chưa biết, cần tư vấn",
        options: [
          { text: "Trực quan, kéo thả", mapping_nodes: [] }, // Blueprint/Visual
          { text: "Làm việc bằng code", mapping_nodes: ["69a6abc9e80a2d2c8f715a39"] }
        ]
      },
      {
        question_text: "Câu hỏi 4.2: Cấu hình máy tính của bạn như thế nào?",
        parent_question_id: q3_Engine,
        required_option_text: "Chưa biết, cần tư vấn",
        options: [
          { text: "Máy yếu/trung bình (Laptop văn phòng, PC đời cũ)", mapping_nodes: ["69a6abc9e80a2d2c8f715a38"] }, // Unity nhẹ hơn
          { text: "Máy mạnh (Card đồ họa rời RTX, RAM > 16GB)", mapping_nodes: [] }
        ]
      },

      // --- NHÁNH UNITY (Nếu chọn 3A) ---
      {
        question_text: "Câu hỏi 5: Bạn muốn làm loại game nào?",
        parent_question_id: q3_Engine,
        required_option_text: "Unity",
        options: [
          { text: "Game 2D", mapping_nodes: ["69a6abcae80a2d2c8f715a5e"] }, // Animation/Sprite
          { text: "Game 3D", mapping_nodes: ["69a6abcae80a2d2c8f715a4d"] } // Scene/GameObject
        ]
      },
      {
        _id: q6_UnityExp,
        question_text: "Câu hỏi 6: Bạn đã từng sử dụng Unity chưa?",
        parent_question_id: q3_Engine,
        required_option_text: "Unity",
        options: [
          { text: "Chưa từng", mapping_nodes: ["69a6abcae80a2d2c8f715a4c"] },
          { text: "Đã dùng cơ bản", mapping_nodes: ["69a6abcae80a2d2c8f715a51"] }, // Lifecycle
          { text: "Đã làm project", mapping_nodes: ["69a6abcbe80a2d2c8f715a6c"] } // Architecture
        ]
      },
      {
        question_text: "Câu hỏi 7: Bạn đã quen với cài đặt phần mềm nặng hay giao diện phức tạp chưa?",
        parent_question_id: q6_UnityExp,
        required_option_text: "Chưa từng",
        options: [
          { text: "Rồi", mapping_nodes: ["69a6abcae80a2d2c8f715a4c"] },
          { text: "Chưa", mapping_nodes: ["69a6abcae80a2d2c8f715a50"] } // Project Structure
        ]
      },
      {
        question_text: "Câu hỏi 8: Trình độ C# của bạn?",
        parent_question_id: q3_Engine,
        required_option_text: "Unity",
        options: [
          { text: "Chưa biết", mapping_nodes: ["69a6abc9e80a2d2c8f715a39"] },
          { text: "Biết cơ bản", mapping_nodes: ["69a6abcae80a2d2c8f715a3f"] },
          { text: "Biết OOP", mapping_nodes: ["69a6abcae80a2d2c8f715a47"] }
        ]
      },

      // --- NHÁNH UNREAL (Tạm thời mapping trống) ---
      {
        question_text: "Câu hỏi 5 (UE): Bạn muốn làm loại game nào?",
        parent_question_id: q3_Engine,
        required_option_text: "Unreal Engine 5",
        options: [
          { text: "Game 3D", mapping_nodes: [] },
          { text: "Game đồ họa cao (AAA)", mapping_nodes: [] }
        ]
      },

      // --- NHÁNH ADVANCED (Nếu chọn 1C) ---
      {
        question_text: "Câu hỏi 10: Engine chính của bạn là gì?",
        parent_question_id: q1_Level,
        required_option_text: "Advanced (đã làm game, muốn nâng cao hoặc đi làm)",
        options: [
          { text: "Unity", mapping_nodes: ["69a6abcbe80a2d2c8f715a6c"] },
          { text: "Unreal Engine", mapping_nodes: [] }
        ]
      },
      {
        question_text: "Câu hỏi 11: Mục tiêu của bạn là gì?",
        parent_question_id: q1_Level,
        required_option_text: "Advanced (đã làm game, muốn nâng cao hoặc đi làm)",
        options: [
          { text: "Làm việc tại studio", mapping_nodes: ["69a6abcbe80a2d2c8f715a75", "69a6abcbe80a2d2c8f715a7d"] }, // Optimization & Deploy
          { text: "Làm game indie", mapping_nodes: ["69a6abcae80a2d2c8f715a62", "69a6abcbe80a2d2c8f715a7d"] } // UI & Deploy
        ]
      }
    ];

    await questions.insertMany(quizData);
    console.log(`✅ Thành công! Đã nạp ${quizData.length} câu hỏi phân nhánh vào MongoDB.`);

  } catch (error) {
    console.error("❌ Lỗi nạp dữ liệu:", error);
  } finally {
    await client.close();
  }
}

seedQuiz();