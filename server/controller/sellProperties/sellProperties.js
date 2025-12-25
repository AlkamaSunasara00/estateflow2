const connection = require("../../connection/connection");

const sellProperty = (req, res) => {
    const { property_id, buyer_id, assigned_by, amount, details } = req.body;

    if (!property_id || !buyer_id || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const checkPropertyQ = "SELECT * FROM properties WHERE id = ?";

    connection.query(checkPropertyQ, [property_id], (err, propData) => {
        if (err)
            return res.status(500).json({ error: "Database error", details: err });

        if (propData.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (propData[0].status === "sold") {
            return res.status(400).json({
                message: "Property already sold",
            });
        }

        // 1. Insert into sell_properties
        const insertSellQ = `
      INSERT INTO sell_properties
      (property_id, buyer_id, assigned_by, amount, details)
      VALUES (?, ?, ?, ?, ?)
    `;

        connection.query(
            insertSellQ,
            [property_id, buyer_id, assigned_by, amount, details],
            (err) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: "Insert failed", details: err });

                // 2. Mark property as sold
                const updatePropertyQ =
                    "UPDATE properties SET status = 'sold' WHERE id = ?";

                connection.query(updatePropertyQ, [property_id], (err) => {
                    if (err)
                        return res
                            .status(500)
                            .json({ error: "Status update failed", details: err });

                    return res.status(201).json({
                        message: "Property sold successfully",
                    });
                });
            }
        );
    });
};

module.exports = {
    sellProperty
};