import Config

config :langchain, openai_key: System.fetch_env!("OPENAI_API_KEY")
