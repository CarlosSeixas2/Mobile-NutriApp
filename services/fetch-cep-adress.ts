interface AddressData {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export async function fetchAddressFromCep(
  cepValue: string
): Promise<AddressData | null> {
  const formattedCep = cepValue.replace(/\D/g, "");

  if (formattedCep.length !== 8) {
    return null;
  }

  try {
    const response = await fetch(
      `https://viacep.com.br/ws/${formattedCep}/json/`
    );

    const data: AddressData = await response.json();

    if (data.erro) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching address:", error);
    throw new Error("Failed to fetch address data");
  }
}
