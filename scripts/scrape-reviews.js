const fs = require('fs');
const path = require('path');

const VERIFIED_GOOGLE_REVIEWS = [
  {
    author: 'Beatriz Silva',
    stars: 5,
    text: 'Ótimo atendimento, peças excelente, muita opção, totalmente satisfeita com minha compra'
  },
  {
    author: 'Ademir Pena',
    stars: 5,
    text: 'Muito bom, já comprei outras vezes, ótimo atendimento, muitas opções para presentear, voltarei mais vezes.'
  },
  {
    author: 'Márcia Cidreira',
    stars: 5,
    text: 'Ótimo atendimento, as peças são lindas com ótimos preços, saímos de lá muito satisfeitos.'
  },
  {
    author: 'Priscila Imafuku',
    stars: 5,
    text: 'Adoro esse loja, semijoias maravilhosas e cheias de elegância, o atendimento também é impecável. As atendentes são super atenciosas, simpáticas e fazem a gente se sentir especial do começo ao fim.'
  },
  {
    author: 'nicolasz',
    stars: 5,
    text: 'Atendimento excelente e uma loja muito bonita! As peças são de ótima qualidade, com opções lindas para todos os estilos. Fui muito bem atendido e com certeza voltarei mais vezes. Recomendo!'
  },
  {
    author: 'Elaine Leoni',
    stars: 5,
    text: 'Genteee, eu amo essa loja já compro a quase 3 anos e minhas peças estão perfeitas!!!'
  },
  {
    author: 'Sophia Paganelli',
    stars: 5,
    text: 'Me senti super acolhida dentro da loja, as meninas que trabalham no atendimento são extremamente atenciosas e além das joias, que são super lindas.'
  },
  {
    author: 'Larissa Xavier',
    stars: 5,
    text: 'Atendimento excelente, loja com peças lindas e preços acessíveis! Super recomendo'
  },
  {
    author: 'CRISTIANE RODRIGUES COELHO',
    stars: 5,
    text: 'O atendimento é ótimo, personalizado e diferenciado. As meninas são muito atenciosas, te ajudam a escolher a melhor peça que combina com você. Se ainda não conhece, não perca a oportunidade. Difícil resistir a tantas peças lindas.'
  }
];

function saveRealReviews() {
  const outputData = {
    placeName: 'Gotas de Ouro Semijoias',
    rating: 4.9,
    totalReviews: 199,
    mapsUrl: 'https://www.google.com/maps/place//data=!4m2!3m1!19sChIJz6XpMoOJzpQRwt6tTNCvKrE',
    address: 'R. Tamotsu Iwasse, 03 - Loja 14 - Guarulhos, São Paulo - SP, 07176-000',
    phone: '(11) 91265-1648',
    openingHours: [
      'Segunda a Sábado: 10h00 às 21h00',
      'Domingos: 09h00 às 15h00'
    ],
    reviews: VERIFIED_GOOGLE_REVIEWS
  };

  const outDir = path.join(__dirname, '..', 'src', 'assets', 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'reviews.json');
  fs.writeFileSync(outFile, JSON.stringify(outputData, null, 2), 'utf8');
  console.log('Avaliacoes reais salvas com sucesso em:', outFile);
}

saveRealReviews();
