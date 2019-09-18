module.exports = {
    apps : [
        {
            name: "Smart",
            script: "./bin/www",
            watch: true,
            env: {
                "NODE_ENV": "production",
            }
        }
    ]
}