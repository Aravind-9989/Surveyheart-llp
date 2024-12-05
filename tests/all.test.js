
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../main");
const bcrypt = require("bcrypt");
const Signup = require("../models/Signupschema");
const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NGQzNDI1NTY0ZTY3NDNiNTc5YjVkNSIsImVtYWlsIjoic2hldHR5QGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczMzExMjg5MSwiZXhwIjoxNzMzMTE2NDkxfQ.EaBCkjcZJVO2KjA5JnJ-QpACkw7t3sgUE3kljie1Ye0";
const secretKey = "HelloUser";
const fs = require("fs");
const path = require('path');


jest.setTimeout(100000);

describe("User Register and Login", () => {
  let token;

  beforeAll(async () => {
    await mongoose.connect("mongodb://localhost:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Signup.deleteMany();
    const hashedPassword = await bcrypt.hash("Shettys", 10);
    await Signup.create({
      Name: "survey",
      email: "survey@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test("POST /survey/Entries -user registers successfully", async () => {
    const newUser = {
      Name: "Aravind",
      email: "Aravind@gmail.com",
      password: "Aravind",
      role: "admin",
    };

    const response = await supertest(app).post("/survey/Entries").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User signup successful");
  });
// existing user 
  test("POST /survey/Entries - fails to register a user with an existing email", async () => {
    const existingUser = {
      Name: "survey",
      email: "survey@gmail.com",
      password: "Shettys",
      role: "admin",
    };

    const response = await supertest(app)
      .post("/survey/Entries")
      .send(existingUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Candidate already exists.");
  });

// email 

test("POST /survey/Login - fails  email not found", async () => {
  const user = {
    email: "survey@gmail.com", 
    password: "Shetty",  
  };

  const response = await supertest(app)
    .post("/survey/Login")
    .send(user);

  expect(response.status).toEqual(400);
  expect(response.body.message).toEqual("Invalid email or password.");
});


  // user login
  test("POST /survey/Login - successfully logs in a user", async () => {
    const user = {
      email: "survey@gmail.com",
      password: "Shettys",
    };

    const response = await supertest(app).post("/survey/Login").send(user);

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body.message).toBe("User login successful.");

    token = response.body.token;
  });

  // incorrect password
  test("POST /survey/Login - fails with incorrect password", async () => {
    const user = {
      email: "survey@gmail.com",
      password: "WrongPassword",
    };

    const response = await supertest(app).post("/survey/Login").send(user);

    console.log("Failed Login", response.body);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid email or password.");
  });

  // endpoint testing
  test("GET /survey/protected-endpoint - accesses protected route with valid token", async () => {
    const response = await supertest(app)
      .get("/survey/protected-endpoint")
      .set("authorization", `Bearer ${token}`);

    console.log("Protected Route Response:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Accessgranted");
  });

  // without token
  test("GET /survey/protected-endpoint - fails without token", async () => {
    const response = await supertest(app).get("/survey/protected-endpoint");

    console.log("Protected Route Without Token Response:", response.body);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(
      "Authentication token is missing or invalid"
    );
  });
});

// product adding

describe("productdetails", () => {
  test("POST /File product added sucessfully", async () => {
    const Newproduct = {
      ProductName: "Lenin",
      ProductDescrption: "Clothing brand",
      ProductPrice: 2500,
      location: "Hyderabad",
      quantity: "60",
    };
    const form = new FormData();

    form.append("ProductName", Newproduct.ProductName);
    form.append("ProductDescrption", Newproduct.ProductDescrption);
    form.append("ProductPrice", Newproduct.ProductPrice);
    form.append("location", Newproduct.location);
    const imagePath = path.resolve(
      "C:/Users/saritha/Pictures/Screenshots/pictures.jpg"
    );

    if (!fs.existsSync(imagePath)) {
      console.log("Image file not found at:", imagePath);
      return;
    }
    form.append("Image", fs.createReadStream(imagePath));

    form.append("quantity", Newproduct.quantity);

    const response = await request.post("/Routes/File").send(form);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe({
      message: "Product added successfully",
    });
  });

  // all fields are required & Test for error when quantity & exceeds 50

  test("POST /File error occurs when quantity exceeds 50", async () => {
    const Quantity = {
      ProductName: "Lenin",
      ProductDescrption: "Clothing brand",
      ProductPrice: 2500,
      location: "Hyderabad",
      quantity: "80", 
    };
    const form = new FormData();
    form.append("ProductName", Quantity.ProductName);
    form.append("ProductDescrption", Quantity.ProductDescrption);
    form.append("ProductPrice", Quantity.ProductPrice);
    form.append("location", Quantity.location);
    const imagePath = path.resolve(
      "C:/Users/saritha/Pictures/Screenshots/pictures.jpg"
    );

    if (!fs.existsSync(imagePath)) {
      console.log("Image file not found at:", imagePath);
      return;
    }
    form.append("Image", fs.createReadStream(imagePath));

    form.append("quantity", Quantity.quantity);

    const response = await request.post("/Routes/File").send(form);
    expect(response.status).toBe(200);
    console.log(response)
    expect(response.body.message).toEqual("product limit exceeded and items were sold out"); 
  });
// get by id

  //  describe('GET /fetch/:id', () => {
   
  //     it('should return user details when valid ID is provided', async () => {
  //       const userId = '674e9001dec6b3d24f55e3a9'; 
  //       const mockUser  = { _id:`${id}`, Name: 'Test User', email: 'testuser@example.com' };
    
  //       Signup.findById = jest.fn().mockResolvedValue(mockUser);
    
  //       const response = await supertest(app).get(`/fetch/${id}`);
    
  //       expect(response.status).toBe(200);
  //       console.log(response.status)
  //       expect(response.body.message).toBe('Product details not found.'); 
  //       expect(response.body.data).toEqual(mockUser );
  //       expect(Signup.findById).toHaveBeenCalledWith(id);
  //     });
  //  } 

// All products
jest.mock("../models/fileschema", () => ({
  find: jest.fn(),
  aggregate: jest.fn()
}));

describe("GET /Allproducts", () => {
  let request;

  // Before each test, reset mocks
  beforeEach(() => {
    // Mock the find and aggregate methods
    const File = require("../models/fileschema"); // Make sure you're importing File here
    File.find.mockReset();
    File.aggregate.mockReset();

    // You can also reset the mocks in any other necessary way if needed
  });

  it("should fetch all products successfully", async () => {
    const File = require("../models/fileschema"); // Import the mock here as well to avoid undefined error

    // Mock responses for the find and aggregate methods
    File.find.mockResolvedValue([
      { productName: "Product1", location: "Hyderabad", ProductPrice: 100, quantity: 10 },
      { productName: "Product2", location: "Mumbai", ProductPrice: 200, quantity: 5 },
    ]);

    File.aggregate.mockResolvedValue([
      { price: 300, totalQuantity: 15 }
    ]);


    const response = await request(app).get("/Routes/Allproducts");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Fetched all products successfully");
    expect(response.body.product.length).toBe(2); // Two products in the mock data
    expect(response.body.totalPrice).toBe(300);
    expect(response.body.totalQuantity).toBe(15);
  });
});

})
