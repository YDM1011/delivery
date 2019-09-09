module.exports = {
    apps : [
        {
            name: "Laundrwise",
            script: "./bin/www",
            watch: true,
            env: {
                "NODE_ENV": "production",
            }
        }
    ]
}