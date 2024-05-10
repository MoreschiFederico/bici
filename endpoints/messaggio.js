function endpoint(app, connpool) {

    app.post("/api/discussioni", (req, res) => {
        var errors = []
        /* controllo dati inseriti
        if (!req.body.description) {
            errors.push("No description specified");
        }
        if (req.body.status === "") {
            errors.push("No status specified");
        }
        */
        if (errors.length) {
            res.status(400).json({ "error": errors.join(",") });
            return;
        }
        var data = {
            titolo: req.body.titolo,
            testo: req.body.testo,
            argomento: req.body.argomento
        }

        var sql = 'INSERT INTO discussione (titolo, testo, argomento) VALUES (?,?,?)'
        var params = [data.titolo, data.testo, data.argomento]
        connpool.query(sql, params, (error, results) => {
            if (error) {
                res.status(400).json({ "error": error.message })
                return;
            }
            res.json({
                "message": "success",
                "data": data,
                "id": this.insertID
            })
            console.log(results)
        });

    })



    app.get("/api/discussioni", (req, res, next) => {
        var sql = "select * from discussione"
        var params = []
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
    });


    app.get("/api/discussioni/:id", (req, res) => {
        var sql = "select * from discussione where idDiscussione = ?"
        var params = [req.params.id]
        connpool.query(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows[0]
            })
        });
    });


    app.put("/api/discussioni/:id", (req, res) => {
        var data = {
            titolo: req.body.titolo,
            testo: req.body.testo,
            argomento: req.body.argomento
        }
        connpool.execute(
            `UPDATE discussione set 
               titolo = COALESCE(?,titolo), 
               testo = COALESCE(?,testo),
               argomento = COALESCE(?,argomento) 
               WHERE idUtente = ?`,
            [data.titolo, data.testo, data.argomento, req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                console.log(result)
                res.json({
                    message: "success",
                    data: data,
                    changes: result.affectedRows
                })
            });
    })



    app.delete("/api/discussioni/:id", (req, res) => {
        connpool.execute(
            'DELETE FROM discussione WHERE idDiscussione = ?',
            [req.params.id],
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
                res.json({ "message": "deleted", changes: result.affectedRows })
            });
    })


}





module.exports = endpoint;