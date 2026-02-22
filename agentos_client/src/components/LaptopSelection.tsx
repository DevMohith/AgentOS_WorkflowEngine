import API from "../api/api";

interface Props {
  runId: string;
  refresh: () => void;
}

export default function LaptopSelection({ runId, refresh }: Props) {
  const selectLaptop = async (model: string) => {
    await API.patch(`/runs/${runId}/context`, {
      laptop_model: model,
    });

    await API.post(`/runs/resume/${runId}`);

    await refresh();
  };

  return (
    <div>
      <h3>Select Laptop</h3>

      <button onClick={() => selectLaptop("Windows - Dell XPS")}>
        Dell XPS
      </button>

      <button onClick={() => selectLaptop("Mac - MacBook Pro")}>
        MacBook Pro
      </button>
    </div>
  );
}