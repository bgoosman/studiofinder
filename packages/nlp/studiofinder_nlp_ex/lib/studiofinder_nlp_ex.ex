defmodule StudiofinderNlpEx do
  @moduledoc """
  Documentation for `StudiofinderNlpEx`.
  """

  alias LangChain.Message
  alias LangChain.ChatModels.ChatOpenAI
  alias LangChain.Chains.LLMChain
  alias LangChain.Function

  def main do
    [user_query] = System.argv()

    config = %{
      endpoint: "http://litellm-proxy:38383/v1/chat/completions",
      model: "gpt-4o-mini"
    }

    json = File.read!("priv/universe.json") |> Jason.decode!()

    place_ids = get_place_ids(json) |> dbg()

    # a custom Elixir function made available to the LLM
    availability_fn =
      Function.new!(%{
        name: "availability",
        description: "Given the id of a place, returns the available slots.",
        parameters_schema: %{
          type: "object",
          properties: %{
            id: %{
              type: "string",
              description: "The id of the place. One of #{place_ids |> Jason.encode!()}"
            }
          },
          required: ["id"]
        },
        function: fn %{"id" => id} = _arguments, json ->
          # our context is a pretend item/location location map
          {:ok, get_available_slots(json, id) |> dbg() |> Jason.encode!()}
        end
      })

    # create and run the chain
    {:ok, updated_chain, %Message{} = message} =
      LLMChain.new!(%{
        llm: ChatOpenAI.new!(config),
        custom_context: json,
        verbose: true
      })
      |> LLMChain.add_tools(availability_fn)
      |> LLMChain.add_message(Message.new_system!("Help the user find availability. Use the tools provided."))
      |> LLMChain.add_message(Message.new_user!(user_query))
      |> LLMChain.run(mode: :while_needs_response)
  end

  def get_place_ids(json) do
    # For each json["places"], add the id to the list.
    # Then call get_place_ids on each json["places"].
    json["places"]
    |> Enum.flat_map(fn place ->
      [place["id"]] ++ get_place_ids(place)
    end)
  end

  def get_place(json, path) do
    # Find the place with the given path in the json.
    # If the path is empty, return the json.
    # Otherwise, find the place with the first element of the path in the json.
    # Then call get_place with the rest of the path in the place.
    if path == [] do
      json
    else
      # Find the place in json["places"] where place["name"] == path[0]
      json["places"]
      |> Enum.find(fn place -> place["name"] == hd(path) end)
      |> get_place(tl(path))
    end
  end

  def get_available_slots(json, place_id) do
    # Find Place with place_id in json, then for all places under that place, get the available slots.
    IO.puts("Getting available slots for #{place_id}")
    # id = Universe>Brooklyn>Triskelion
    path = place_id |> String.split(">") |> tl()
    # path = ["Brooklyn", "Triskelion"]
    place = get_place(json, path)
    # place = %{"name" => "Triskelion", "slots" => [{"start" => "2022-01-01T00:00:00Z", "end" => "2022-01-01T01:00:00Z"}, ...]}
    slots = get_available_slots_from_all_child_places(place)
    slots
    |> Enum.map(&Map.take(&1, ["start", "end"]))
    # [{"2022-01-01T00:00:00Z", "2022-01-01T01:00:00Z"}, ...]
  end

  def get_available_slots_from_all_child_places(place) do
    # For all places under place, get the available slots.
    # If place has no children, return the slots of place.
    # Otherwise, get the slots of all children of place.
    if place["places"] == [] do
      place["slots"]
    else
      place["places"]
      |> Enum.flat_map(&get_available_slots_from_all_child_places/1)
    end
  end
end
