const connection = require("../../connection/connection");

const buyProperty = (req, res) => {
    const { property_id, seller_id, assigned_by, amount, details } = req.body;

    if (!property_id || !seller_id || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const checkPropertyQ = "SELECT * FROM properties WHERE id = ?";

    connection.query(checkPropertyQ, [property_id], (err, propData) => {
        if (err)
            return res.status(500).json({ error: "Database error", details: err });

        if (propData.length === 0) {
            return res.status(404).json({ message: "Property not found" });
        }

        // 1. Insert into buy_properties
        const insertBuyQ = `
      INSERT INTO buy_properties
      (property_id, seller_id, assigned_by, amount, details)
      VALUES (?, ?, ?, ?, ?)
    `;

        connection.query(
            insertBuyQ,
            [property_id, seller_id, assigned_by, amount, details],
            (err) => {
                if (err)
                    return res
                        .status(500)
                        .json({ error: "Insert failed", details: err });

                // 2. KEEP property available (admin inventory)
                const updatePropertyQ =
                    "UPDATE properties SET status = 'available' WHERE id = ?";

                connection.query(updatePropertyQ, [property_id], (err) => {
                    if (err)
                        return res
                            .status(500)
                            .json({ error: "Status update failed", details: err });

                    return res.status(201).json({
                        message: "Property bought and added to inventory",
                    });
                });
            }
        );
    });
};

module.exports = {
    buyProperty
};