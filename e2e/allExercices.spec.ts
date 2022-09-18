import { test, expect } from '@playwright/test'

const refToUuid = {
  '1AN10-1': '29202',
  '1AN11': '4c8c7',
  '1AN14-4': '1a60f',
  '1AN14-5': 'b32f2',
  '1AN14-6': '3391d',
  '1E10': 'feb39',
  '1E11': '0fbd1',
  '1E11-1': '731f0',
  '1E11-2': 'cf78f',
  '1E11-3': '60504',
  '1E11-4': '89559',
  '1E11-5': '3de81',
  '1E12': '392b3',
  '1E12-1': 'a896e',
  '1E13': '334ca',
  '1E14': 'a8e1b',
  '1E15': 'fe4df',
  '1E16': '77bcc',
  '1F10': '2af1c',
  '1G10': '4e684',
  '1G11': 'a720c',
  '1G12': 'b9e6a',
  '1N10': 'f0c2d',
  '1N11': 'b8c14',
  '1P10': '9ccfd',
  '2F10-1': '90998',
  '2F10-2': '93f13',
  '2F10-3': 'c360e',
  '2F10-4': 'ef897',
  '2F10-5': '03b71',
  '2F10-6': 'b72b0',
  '2F11-1': 'b6cc0',
  '2F12-1': 'de0d1',
  '2F20-1': '36795',
  '2F25-1': '6e82d',
  '2F25-2': '1e362',
  '2F31-1': '1803c',
  '2F31-2': '1ca05',
  '2F31-3': 'c705b',
  '2F32-2': '573f2',
  '2F32-3': 'acee0',
  '2G10-1': '430b9',
  '2G10-2': '86a65',
  '2G11-1': '109b1',
  '2G11-2': 'eab10',
  '2G11-3': '20907',
  '2G11-5': '65bed',
  '2G12-1': 'c5480',
  '2G12-2': '4b25a',
  '2G12-3': '31760',
  '2G12-4': 'd633a',
  '2G21-1': '2b8bf',
  '2G22-1': '3a3ec',
  '2G23-2': 'fa7b9',
  '2G24-1': 'f71c1',
  '2G30-1': '1ea16',
  '2G30-2': '0cee9',
  '2G30-3': '1bb30',
  '2G30-4': '0ec77',
  '2G30-5': 'd1da3',
  '2G33-1': 'b1777',
  '2G33-2': 'e715d',
  '2G35-7': '41e6f',
  '2N10-1': '507cf',
  '2N10-2': '8164e',
  '2N10-3': '7cfbe',
  '2N11-1': '31c01',
  '2N11-2': 'dc2a5',
  '2N12-1': 'd309b',
  '2N12-2': '8f56e',
  '2N13-1': 'bba9b',
  '2N14-1': '25fb4',
  '2N15-1': '0d8b3',
  '2N15-2': 'e471c',
  '2N20-1': '7cf48',
  '2N20-2': 'd5a6d',
  '2N20-3': '098db',
  '2N20-4': 'c04cc',
  '2N20-5': 'c14e8',
  '2N20-6': '74939',
  '2N20-7': 'c3c84',
  '2N20-8': '3ec5c',
  '2N30-1': '45726',
  '2N30-2': 'b51ec',
  '2N30-3': '29919',
  '2N30-4': 'cb572',
  '2N30-5': '6575c',
  '2N30-6': 'c1561',
  '2N30-7': 'd0fdc',
  '2N31-0': '53fbb',
  '2N31-1': 'c9404',
  '2N31-2': '1e42b',
  '2N31-3': '0ecd3',
  '2N31-4': '6fda8',
  '2N32-1': '55cc0',
  '2N32-2': '99b29',
  '2N32-3': 'd9495',
  '2N32-4': '12b72',
  '2N32-5': '660de',
  '2N32-6': '91dc4',
  '2N32-7': '4771d',
  '2N40-1': '0a01e',
  '2N40-2': '98658',
  '2N40-3': 'a16a0',
  '2N40-4': '60cc5',
  '2N40-5': '2e5df',
  '2N40-6': '74c5a',
  '2N41-1': '3d2f9',
  '2N41-2': '47f20',
  '2N41-3': '3b7ee',
  '2N41-4': '877a9',
  '2N41-5': '5a4ad',
  '2N41-6': '04b0a',
  '2N41-7': '874e8',
  '2N41-7v2': '0bd00',
  '2N50-1': '622b9',
  '2N50-2': '27741',
  '2N50-3': '846b8',
  '2N50-4': 'cf5b7',
  '2N51-1': '71e5c',
  '2N51-2': 'ad208',
  '2N51-3': '7959f',
  '2N51-3v2': '78f02',
  '2N51-4': 'd02da',
  '2N51-5': '3b3d9',
  '2N52-1': '53762',
  '2N52-2': 'bb6d5',
  '2N52-4': '93432',
  '2N60-4': 'bc1e4',
  '2N61-2': '014a4',
  '2N61-4': '0716b',
  '2S10-2': '612a5',
  '2S11-1': '05db7',
  '2S11-2': '12444',
  '2S12-2': '018f3',
  '2S12-3': '509db',
  '2S20-1': 'dc3d2',
  '2S20-2': '4bc38',
  '2S20-4': '55d00',
  '2S30-2': '28dfd',
  '2S30-3': '0cf54',
  '2S30-4': 'e1938',
  '2S30-5': 'cee5d',
  '3A10': '5b60d',
  '3A10-1': 'bba55',
  '3A10-2': '526f8',
  '3A10-3': '32f33',
  '3A10-4': '4117b',
  '3A10-5': 'eee79',
  '3A10-6': '5636e',
  '3A11': 'a6667',
  '3A11-1': '80772',
  '3A12': 'ce352',
  '3A12-1': '8c05e',
  '3A13-1': '8741f',
  '3A13-2': 'd8bf2',
  '3A13-3': 'd9cf3',
  '3A13-4': 'b0cee',
  '3F1-act': '77d18',
  '3F10': 'b92da',
  '3F10-1': '0eecd',
  '3F10-2': 'ba520',
  '3F12': '02116',
  '3F12-2': '082d7',
  '3F12-3': 'afb2f',
  '3F12-4': 'b8946',
  '3F13': '8117d',
  '3F13-1': '4b121',
  '3F13-2': 'be398',
  '3F21': 'b4c0d',
  '3F21-1': 'e5ddd',
  '3F21-2': 'b8b33',
  '3F21-3': '056fa',
  '3G10-1': 'd4088',
  '3G10-2': 'd5f34',
  '3G10-3': '19ce6',
  '3G11': '18e25',
  '3G12': '442e0',
  '3G12-1': '034f1',
  '3G13': '6f383',
  '3G20': '74eac',
  '3G20-1': 'eea67',
  '3G21': '3451c',
  '3G22': '960f9',
  '3G22-1': 'a0ad1',
  '3G23': '91513',
  '3G30': 'bd6b1',
  '3G30-1': '0d1f7',
  '3G31': '0ac11',
  '3G31-1': '35e0b',
  '3G32': '95adb',
  '3G32-0': '2045e',
  '3G32-1': 'e0287',
  '3G32-2': '5986b',
  '3G32-3': 'e42e0',
  '3G32-4': '3cb52',
  '3G32-5': '8ba77',
  '3G40': '75ea2',
  '3G42': '8c803',
  '3G43': 'acb80',
  '3I1': '8cbd6',
  '3I1-1': '9ff49',
  '3L10': '603a8',
  '3L10-1': '815eb',
  '3L11': '77a62',
  '3L11-1': '4197c',
  '3L11-2': 'f6853',
  '3L11-3': '82313',
  '3L11-4': '5f5a6',
  '3L11-5': 'edbd5',
  '3L11-6': '51360',
  '3L11-7': '7cf81',
  '3L11-8': '1f9b4',
  '3L11-9': '4963b',
  '3L12': '81fd2',
  '3L12-1': 'be157',
  '3L13': 'f239f',
  '3L13-0': '5a02b',
  '3L13-1': '1802d',
  '3L13-2': '6516e',
  '3L13-3': '22412',
  '3L13-4': 'cd2f2',
  '3L14': 'ecf62',
  '3L14-1': 'a8e6c',
  '3L15': '231d2',
  '3L15-1': '57f44',
  '3P10': '0bcef',
  '3P10-1': '4ce2d',
  '3S12': 'f4b95',
  '3S15': '36e68',
  '3S20': '04f53',
  '3S21': '76230',
  '4A10': 'bdb18',
  '4A11-0': '1eaf7',
  '4A11-1': 'b8a38',
  '4A11-2': '426f5',
  '4A12': 'b16c6',
  '4C10-0': '450ae',
  '4C10-1': '4fd42',
  '4C10-10': '857c1',
  '4C10-2': 'aa4f9',
  '4C10-3': '153b9',
  '4C10-4': 'cdcc1',
  '4C10-5': 'c8f4b',
  '4C10-6': '73187',
  '4C10-7': '0b020',
  '4C10-8': '2fbc0',
  '4C10-9': '9e862',
  '4C11': '62f66',
  '4C20': 'd7e11',
  '4C20-1': '7e31e',
  '4C20-2': '7f2be',
  '4C21': '5f429',
  '4C21-1': '5e8fc',
  '4C21-2': '1a61d',
  '4C21-3': '0576d',
  '4C22': '72ce7',
  '4C22-1': '43cea',
  '4C22-2': '55354',
  '4C22-3': 'ee808',
  '4C22-4': '4713e',
  '4C23': '374b6',
  '4C23-1': '18ddd',
  '4C24': '612b9',
  '4C25-0': '9db08',
  '4C30': 'f5dcf',
  '4C30-1': '760d7',
  '4C30-2': '93df9',
  '4C30-3': '36f8b',
  '4C30-4': 'b0b3c',
  '4C32': 'a0d16',
  '4C32-0': '5d72b',
  '4C32-1': '762fe',
  '4C32-2': 'fedae',
  '4C32-3': '051c7',
  '4C32-4': '8b399',
  '4C33-0': '1d078',
  '4C33-1': 'bae57',
  '4C33-3': 'c71da',
  '4C34': '2d79c',
  '4C35': '125bd',
  '4C36': '975cc',
  '4C37': '67432',
  '4F12': 'b428e',
  '4G10': 'cf7ce',
  '4G10-1': '7b40c',
  '4G10-2': '6a2dd',
  '4G11': '3bfb6',
  '4G11-1': '48253',
  '4G12': '4ffdb',
  '4G12-1': '8ac93',
  '4G12-2': '3174f',
  '4G15': '0da6a',
  '4G20': 'bd660',
  '4G20-1': '40c47',
  '4G20-2': 'f5cbd',
  '4G20-4': '41187',
  '4G20-5': '9c484',
  '4G20-6': '516d1',
  '4G21': 'ab5d4',
  '4G22': 'b18e8',
  '4G30': '18a21',
  '4G31': '4dce8',
  '4G40': '3303a',
  '4G40-1': 'b236d',
  '4G40-2': '2f4d7',
  '4G41': '22810',
  '4G51': '0e754',
  '4G52': '9c916',
  '4G53': 'b6cbe',
  '4I1': '33c9a',
  '4I1-2': '8ded2',
  '4L10': '71dd8',
  '4L10-1': 'cc129',
  '4L10-2': 'af8bb',
  '4L10-3': '4c5da',
  '4L10-4': 'a40d6',
  '4L11': 'dd1c9',
  '4L12': '501f9',
  '4L13-0': '5a6f2',
  '4L13-1': '8b18b',
  '4L13-2': '5ca1e',
  '4L14-0': 'a1c9a',
  '4L14-1': '5ecb8',
  '4L14-2': '1188b',
  '4L15-0': 'df5a3',
  '4L15-1': 'ce00c',
  '4L16': '68cda',
  '4L20': '799c4',
  '4L20-0': '515b0',
  '4P10': '72c5a',
  '4P10-1': 'c668a',
  '4P10-2': 'a6b5b',
  '4P16': '63cdb',
  '4S10': '26ea7',
  '4S11': '7c068',
  '4S20': '7ba64',
  '5A10': '4828d',
  '5A11': 'a55d2',
  '5A11-1': 'a3870',
  '5A11-2': '5618d',
  '5A12-1': '36074',
  '5A12-2': '03d65',
  '5A13': '7f50c',
  '5C11': '9d15d',
  '5C11-1': 'baa4b',
  '5C11-2': '3406a',
  '5C12': 'e61fc',
  '5C12-1': 'cd0d8',
  '5G10': 'da157',
  '5G10-1': 'ce9ef',
  '5G10-2': '8ea24',
  '5G11': 'ec32b',
  '5G11-1': '8d4bf',
  '5G11-2': '49786',
  '5G11-3': '34032',
  '5G11-4': '08f60',
  '5G11-5': '2d2bb',
  '5G11-6': '2a611',
  '5G12': '76ea9',
  '5G12-1': '261bf',
  '5G12-2': 'dbc1d',
  '5G12-3': '2d343',
  '5G13': '07d1a',
  '5G20': 'a808d',
  '5G20-0': '36116',
  '5G20-1': 'c3781',
  '5G20-2': '6a1a2',
  '5G21-1': 'f789c',
  '5G22': '796f3',
  '5G22-1': '3acc1',
  '5G24-1': '10148',
  '5G24-2': 'b9a52',
  '5G30': '2b6a2',
  '5G30-1': 'd12db',
  '5G30-2': '19812',
  '5G31': 'dc8c9',
  '5G31-1': 'bcbe1',
  '5G40': 'b611a',
  '5G40-1': 'af2c2',
  '5G40-2': '588fe',
  '5G41': '37e37',
  '5G42': '8812e',
  '5G51': 'a013f',
  '5I11': 'a7650',
  '5L10': '3c1f7',
  '5L10-1': 'fefa0',
  '5L10-2': '12bb6',
  '5L10-3': '458ae',
  '5L10-4': '7aba6',
  '5L12': '85d2d',
  '5L12-1': '46234',
  '5L12-2': 'a8ad0',
  '5L13': '1bce3',
  '5L14': '17e39',
  '5L14-1': '1abc6',
  '5L14-2': '8865d',
  '5L14-3': '2c600',
  '5L14-4': '97f1a',
  '5L14-5': '72764',
  '5L14-6': 'd1a2c',
  '5L15': 'd88d6',
  '5L16': 'e2e64',
  '5M10': 'd6cd1',
  '5M20': 'e26ca',
  '5N10': '91d72',
  '5N11-1': 'f00fb',
  '5N11-2': '5a44b',
  '5N11-3': '0e58f',
  '5N11-4': '6b534',
  '5N110': 'b2c55',
  '5N13': 'f8f4e',
  '5N13-2': '4718e',
  '5N14': '234a7',
  '5N14-2': 'ce9ca',
  '5N14-3': 'd1fb2',
  '5N15': '0a637',
  '5N20': 'd5ee3',
  '5N20-0': 'b6250',
  '5P10': 'aa997',
  '5P11-1': 'a29bd',
  '5P12': '60910',
  '5P13': 'edb61',
  '5R10': '61b4a',
  '5R10-0': 'cab80',
  '5R10-1': '76343',
  '5R11': 'cd7ce',
  '5R11-2': '6d576',
  '5R12': 'cf83c',
  '5R12-2': 'ab968',
  '5R20': 'cbc26',
  '5R20-2': 'ce842',
  '5R20-3': '36e2a',
  '5R20-4': '6667e',
  '5R20-5': '41254',
  '5R20-6': '598c3',
  '5R20-7': '3e4d9',
  '5R21': 'b6982',
  '5R22': 'f6ea7',
  '5R22-2': '070b4',
  '5S10': '60eb8',
  '5S11': '9926a',
  '5S12': 'd3ca7',
  '5S13': '8cdd5',
  '5S13-1': '7d429',
  '5S13-2': 'ff67d',
  '5S14': 'ab91d',
  '5S20': '86db6',
  '5S21': '69e1f',
  '5S21-1': '850b0',
  '5S22': 'df72b',
  '6C10': 'cfa6a',
  '6C10-0': '322a0',
  '6C10-1': '0e6bd',
  '6C10-2': '23bc8',
  '6C10-3': 'a5c5a',
  '6C10-4': 'ace0a',
  '6C10-5': 'fd4d8',
  '6C10-6': '57502',
  '6C10-7a': '26bb9',
  '6C10-7b': '08680',
  '6C11': '2da81',
  '6C11-1': '37267',
  '6C11-2': '4e35d',
  '6C11-3': 'd0cd7',
  '6C12': '28d56',
  '6C12-1': '4e2b2',
  '6C12-3': '7fb24',
  '6C12-4': '529ad',
  '6C13': 'ed0ea',
  '6C20': '01873',
  '6C21': 'bbcac',
  '6C22': '99522',
  '6C23': '64422',
  '6C30': '52939',
  '6C30-0': 'f6413',
  '6C30-1': '2471d',
  '6C30-2': '625c0',
  '6C30-3': '36573',
  '6C30-4': '47a54',
  '6C30-5': '021f3',
  '6C30-6': '18559',
  '6C30-7': '85989',
  '6C30-8': '9540b',
  '6C31': '294bb',
  '6C31-2': '013ef',
  '6C32': '96b94',
  '6C33': '4c10a',
  '6C34': 'b3843',
  '6C35': '4e89b',
  '6D10': '8b0f9',
  '6D101': '6b3e4',
  '6D11': '5f315',
  '6D12': 'e960d',
  '6D13': '4f8f4',
  '6G10': '8f5d3',
  '6G10-1': 'd81c6',
  '6G10-2': 'e8f0b',
  '6G10-3': '83763',
  '6G10-4': '03b49',
  '6G11': '7ff97',
  '6G12': '46429',
  '6G12-1': 'd14bc',
  '6G13': '2203a',
  '6G14': '6a336',
  '6G20': '90e1a',
  '6G20-2': 'b5eaf',
  '6G21': 'e0bc9',
  '6G21-1': 'a07bb',
  '6G22': 'e10d1',
  '6G23': '34e3c',
  '6G23-1': 'c7f7a',
  '6G23-2': '1ad45',
  '6G23-3': '73630',
  '6G23-4': 'ff2cc',
  '6G23-5': '329fe',
  '6G24': 'e9d29',
  '6G24-1': '91a00',
  '6G24-2': 'adfb5',
  '6G24-3': '60e16',
  '6G24-4': '07f8a',
  '6G25': 'd7052',
  '6G25-1': '49cb2',
  '6G25-2': 'f5569',
  '6G25-3': '328b1',
  '6G26': 'd7da5',
  '6G32-1': 'cd69a',
  '6G33': '4e52e',
  '6G41': 'a8e0f',
  '6G42': 'b36df',
  '6G43': '5f115',
  '6G44': 'da6a4',
  '6I10': 'c8fe9',
  '6I11': '0e016',
  '6I12': 'e9cac',
  '6M10': '83be1',
  '6M10-1': '9a5fe',
  '6M11': 'eb45a',
  '6M11-1': 'd1513',
  '6M11-2': '5999f',
  '6M12': '3cb1d',
  '6M20': '06b1a',
  '6M21': '95313',
  '6M22': 'ac571',
  '6M22-1': 'f9a02',
  '6M22-2': 'ff386',
  '6M23': '6225c',
  '6M25': 'dc7ba',
  '6M30': '04b0d',
  '6M30-0': '0d4be',
  '6M31': '33ac2',
  '6M31-2': 'f4d29',
  '6N10': '0688e',
  '6N10-0': '6babf',
  '6N10-1': '7efdf',
  '6N10-2': '6ea89',
  '6N10-3': '34579',
  '6N10-4': 'dc348',
  '6N10-5': '80645',
  '6N10-6': 'c5438',
  '6N10-7': 'f899b',
  '6N11': 'acd4a',
  '6N11-2': '4f2a3',
  '6N11-3': '29b40',
  '6N11-4': '3bba9',
  '6N11-5': 'a7aa7',
  '6N12': 'bb9d8',
  '6N12-1': '89c0c',
  '6N13': '3eae0',
  '6N13-0': '5d1e2',
  '6N14': '87479',
  '6N20': '6c8a1',
  '6N20-1': '1f5de',
  '6N20-2': 'ab44e',
  '6N21': '2ba53',
  '6N22': 'c75b6',
  '6N22-1': '7781a',
  '6N22-2': '6a17f',
  '6N23': '4b9d5',
  '6N23-0': '5eb83',
  '6N23-1': '1acf7',
  '6N23-2': '12773',
  '6N23-3': '23c48',
  '6N23-4': 'e8e24',
  '6N23-5': '4d0dd',
  '6N23-6': 'd5e44',
  '6N23-7': '63f03',
  '6N24': 'ae35d',
  '6N24-1': 'ec005',
  '6N30': 'c1888',
  '6N30-1': '8418e',
  '6N30-2': 'e528e',
  '6N31': 'be1e4',
  '6N31-1': '3e083',
  '6N31-2': '843e5',
  '6N31-3': 'ab793',
  '6N31-4': 'b86b9',
  '6N32': 'c28e5',
  '6N33': 'ddb83',
  '6N33-0': 'a168c',
  '6N33-1': '66756',
  '6N33-2': 'db772',
  '6N33-3': 'd67e9',
  '6N34': 'c57cf',
  '6N41': '06633',
  '6N41-1': 'f8a4d',
  '6N43': '4a128',
  '6N43-2': 'fa2eb',
  '6N43-3': 'bbdd6',
  '6N43-4': 'f894a',
  '6P10': '850d5',
  '6P11': 'f7a14',
  '6P11-1': 'c511f',
  '6P11-2': '65288',
  '6P12': 'b0f4e',
  '6P13': '064ce',
  '6P13-1': '837cd',
  '6P14': '4c6e2',
  '6S10': '17bce',
  '6S10-1': 'adac4',
  '6S11': '99d95',
  CM000: '6d698',
  CM001: '665a0',
  CM002: '77511',
  CM003: '9db38',
  CM004: 'ac900',
  CM005: '30800',
  CM006: 'd8a39',
  CM007: '9fe43',
  CM008: 'ee307',
  CM009: '14688',
  CM010: '6a3de',
  CM011: 'b434c',
  CM012: '67962',
  CM013: '5e009',
  CM014: '9d994',
  CM015: 'fbd32',
  CM016: '8f2a4',
  CM017: 'fc635',
  CM018: '678f9',
  CM019: '1e528',
  CM020: 'fec06',
  CM021: 'bd6ff',
  ExC100: '8e72e',
  FichierDeTests: '8f5f5',
  HPC100: 'ad6a2',
  HPC102: '89071',
  PEA11: '8dbda',
  'PEA11-1': 'a24a6',
  PEA12: '3441e',
  PEA13: 'a7016',
  PEG20: '44b85',
  PEG21: '838fb',
  PEG22: 'b752a',
  PEG23: 'b976a',
  PEG24: 'f9dd2',
  c3C10: 'fa836',
  'c3C10-1': '4e27f',
  'c3C10-2': '40ae0',
  'c3C10-3': 'f92e1',
  'c3C10-4': 'ed7fc',
  c3C11: 'b259a',
  c3C12: 'e2a48',
  c3C13: 'b0311',
  'c3C13-1': 'ec3cc',
  c3C23: '3a087',
  c3C30: '7fa0e',
  c3C31: 'b74c6',
  c3C3CaN: '32a0f',
  c3I11: 'e380b',
  c3N10: '85618',
  'c3N10-1': 'c96de',
  c3N11: 'c0fb1',
  c3N20: 'ec7e4',
  c3N22: '2fa3b',
  c3N23: 'b2f66',
  c3N30: 'c9ba6',
  can1F01: 'f2035',
  can1F02: 'cc460',
  can1F03: 'a8936',
  can1F04: '0f0de',
  can1F05: '053d7',
  can1F06: '26b38',
  can1F07: '5b203',
  can1F08: '45511',
  can1F09: '84ae6',
  can1F10: 'a3e7a',
  can1F11: 'ffbf6',
  can1F12: 'e794b',
  can1F13: '3c690',
  can1F14: 'a1ba2',
  can1F15: '0e984',
  can1F16: '6f32d',
  can1F17: '12089',
  can1F18: 'c4251',
  can1F19: 'c7f8e',
  can1G01: '4c2a0',
  can1G02: '2dd6a',
  can1G03: '21c03',
  can1G04: 'df08a',
  can1G05: 'e20cc',
  can1G06: 'a394f',
  can1G07: '14aa1',
  can1G08: 'e7919',
  can1L01: 'd0042',
  can1L02: 'c74ea',
  can1L03: 'a23a1',
  can1L04: '7a950',
  can1L05: '7e740',
  can1L06: 'd1ad9',
  can1L07: 'c1168',
  can1L08: 'cbbbb',
  can1L09: '6adb0',
  can1P01: '15f6d',
  can1P02: '32394',
  can1P03: '7c8b7',
  can1P04: 'd15f3',
  can1P05: 'ee478',
  can1P06: '73673',
  can1P07: '1b057',
  can1P08: '0f776',
  can1S01: '44c30',
  can1S02: '3f032',
  can1S03: 'fccb4',
  can1S04: 'b119b',
  can1S05: '88acd',
  can1S06: 'fba63',
  can1S07: 'cd45d',
  can1S08: 'baa9f',
  can1S09: '1eb6e',
  can1S10: 'd1261',
  can1S11: '0f014',
  'can1a-2022': '99a59',
  can2C01: '1f399',
  can2C02: '76ac6',
  can2C03: 'b1517',
  can2C04: '69522',
  can2C05: 'c0f74',
  can2C06: 'cc300',
  can2C07: '2af85',
  can2C08: '3a350',
  can2C09: '5da59',
  can2C10: '4b11f',
  can2C11: '031f0',
  can2C12: '9d51d',
  can2C13: 'b31eb',
  can2F01: 'b2c31',
  can2F02: '8b3a9',
  can2F03: '03b1d',
  can2F04: '6f13a',
  can2F05: '82d4a',
  can2F06: '73ab4',
  can2F07: 'd5b6c',
  can2F08: 'e0405',
  can2F09: 'a7515',
  can2F10: '1380f',
  can2F11: '991c2',
  can2F12: '25143',
  can2F13: '1afde',
  can2G01: '4a666',
  can2G02: '31f61',
  can2G03: '6341d',
  can2G04: '8bc88',
  can2G05: 'b0d98',
  can2G06: '1f62f',
  can2G07: '651a5',
  can2G08: 'eaebb',
  can2G09: 'ee579',
  can2G10: '26f3b',
  can2G11: '7bc4a',
  can2G12: '2ba42',
  can2G13: '3a0e1',
  can2G14: '0dfad',
  can2G15: '84eaa',
  can2G16: 'c0d5f',
  can2G17: 'dacc1',
  can2G18: '8a0ce',
  can2L01: '3b832',
  can2L02: 'dfe60',
  can2L03: '05ba1',
  can2L04: '898a7',
  can2L05: '96a78',
  can2L06: '4c675',
  can2L07: '55c60',
  can2L08: 'c1123',
  can2N01: 'f6f76',
  can2N02: 'e31d1',
  can2P01: '763d3',
  can2P02: '38207',
  'can2a-2021': '1f0cd',
  'can2a-2022': '2a4b1',
  can3C01: '8d08f',
  can3C02: 'debe7',
  can3C03: 'f1208',
  can3C04: '1853b',
  can3C05: 'ce089',
  can3C06: '9634b',
  can3C07: '9ae55',
  can3C08: '9094b',
  can3C09: 'a2d6a',
  can3C10: '3c064',
  can3C11: '59365',
  can3C12: '0ad86',
  can3C13: '140ad',
  can3F01: '966a6',
  can3F02: 'c3468',
  can3F03: 'cf55d',
  can3F04: '4b600',
  can3F05: '83a8a',
  can3F06: '17987',
  can3F07: '82f73',
  can3F08: 'f554f',
  can3F09: 'b60f4',
  can3G01: 'dcc68',
  can3G02: '8e651',
  can3G03: '14145',
  can3G04: '85416',
  can3G05: 'c6b9c',
  can3L01: 'ac10f',
  can3L02: '9419f',
  can3L03: 'cb6b3',
  can3L04: 'e7754',
  can3L05: 'ab332',
  can3M01: 'db589',
  can3M02: 'f0128',
  can3P01: '9734b',
  can3S01: '47142',
  can3S02: 'b2a59',
  can3S03: 'd86be',
  can3S04: 'f0983',
  can3S05: 'c9d15',
  can3S06: '87ceb',
  'can3a-2021': 'afd9f',
  'can3a-2022': '6a087',
  can4C01: '1da2d',
  can4C02: '87d2f',
  can4C03: '22c4c',
  can4C04: 'a630a',
  can4C05: '1b4fe',
  can4C06: '11f3c',
  can4C07: 'da898',
  can4C08: '48334',
  can4C09: '92186',
  can4C10: '8cbb4',
  can4C11: '4239a',
  can4C12: '68ea0',
  can4G01: 'f0b9b',
  can4G02: 'a77ed',
  can4G03: 'd9524',
  can4G04: '4b711',
  can4G05: '66672',
  can4G06: '61c07',
  can4G07: 'ae712',
  can4G08: 'b1a48',
  can4L01: '0641c',
  can4L02: 'c5700',
  can4L03: '91cd5',
  can4L04: '12514',
  can4L05: '56a2d',
  can4L06: 'e75ae',
  can4L07: '97664',
  can4L08: 'a6e97',
  can4P01: '8767b',
  can4P02: '7374f',
  can4P03: '709b6',
  can4P04: 'c58e0',
  can4P05: '8171f',
  'can4a-2021': '60563',
  'can4a-2022': 'cf47f',
  can5A01: 'af3c8',
  can5C01: '102f4',
  can5C02: '5ecdc',
  can5C03: '62e1f',
  can5C04: '52336',
  can5C05: '63dff',
  can5C06: 'bc6a9',
  can5C07: '14b41',
  can5C08: '2aa64',
  can5C09: '1a593',
  can5C10: '1b91d',
  can5C11: '606fd',
  can5C12: 'e4b95',
  can5C13: 'ca4ce',
  can5C14: '4fc0e',
  can5C15: '6b25b',
  can5C16: '7d21c',
  can5C17: 'b1881',
  can5C18: '1f71c',
  can5C19: '1293c',
  can5C20: '0f007',
  can5C21: '843e1',
  can5D01: 'd8797',
  can5D02: '47802',
  can5D03: '5430f',
  can5G01: '6314c',
  can5G02: '7b386',
  can5G03: '36f08',
  can5L01: 'cc70a',
  can5N01: 'f8f99',
  can5N02: 'b850a',
  can5P01: '7487c',
  can5P02: 'bd5d1',
  can5P03: '57777',
  can5P04: 'eb6bc',
  can5P05: '6946a',
  can5P06: '802cc',
  can5P07: 'afbda',
  can5P08: 'c3a01',
  'can5a-2020': '7292b',
  'can5a-2021': '339a1',
  'can5a-2022': '1fdf7',
  'can5a-xxxx': '9e40d',
  can6C01: 'de779',
  can6C02: '5c1b3',
  can6C03: '2e274',
  can6C04: '5b591',
  can6C05: 'c8078',
  can6C06: '8be78',
  can6C07: 'b3aee',
  can6C08: 'fc2fd',
  can6C09: '592c7',
  can6C10: 'eae92',
  can6C11: '50fc4',
  can6C12: 'c3b5b',
  can6C13: 'c3e17',
  can6C14: '90d0d',
  can6C15: '84b48',
  can6C16: '88435',
  can6C17: 'daaa3',
  can6C18: 'd02a7',
  can6C19: 'd656b',
  can6C20: '9e396',
  can6C21: '89135',
  can6C22: 'bf6e6',
  can6C23: 'ad0ee',
  can6C24: '53034',
  can6C25: '81a00',
  can6C26: '31096',
  can6C27: '02170',
  can6C28: '2ce71',
  can6C29: 'c9168',
  can6C30: '16ea9',
  can6C31: '5b443',
  can6C32: '109ae',
  can6C33: 'a905f',
  can6C34: '7a19d',
  can6C35: '95dd2',
  can6C36: '6e1de',
  can6C38: '4e198',
  can6C39: '892f2',
  can6C40: 'bfec4',
  can6D01: '1db82',
  can6D02: '46e66',
  can6D03: '05b2e',
  can6D04: 'd34e5',
  can6G01: '135d4',
  can6G02: '76b93',
  can6G03: '5571c',
  can6G04: 'd30d1',
  can6G05: '84be1',
  can6G06: '86ea3',
  can6G07: '85dfb',
  can6I01: '667d1',
  can6M01: '79035',
  can6M02: 'ac56a',
  can6M03: 'd52aa',
  can6M04: 'c0bf1',
  can6M05: 'a39f6',
  can6M06: 'e52ba',
  can6M07: '62de7',
  can6M08: 'bae27',
  can6M09: 'd5c88',
  can6M10: 'f8019',
  can6M11: 'e332d',
  can6M12: '08764',
  can6N01: '5cffb',
  can6N02: '75d40',
  can6N03: '1dbee',
  can6N04: 'ca515',
  can6N05: '22f41',
  can6N06: 'ad44e',
  can6N07: '34d01',
  can6N08: '73d76',
  can6N09: 'cc882',
  can6N10: '93bb5',
  can6N11: '79452',
  can6N12: '8f060',
  can6N13: 'ce3da',
  can6N14: 'dcf22',
  can6N15: '41030',
  can6N16: 'fb7ac',
  can6N17: 'aa22e',
  can6P01: '6de10',
  can6P02: '5e28d',
  can6P03: 'b0f1a',
  can6P04: 'da0c1',
  can6P05: 'a2bbc',
  can6S01: '1957a',
  'can6a-2018': '5c46d',
  'can6a-2021': '90c8c',
  'can6a-2022': 'b9634',
  'can6a-xxxx': '3a526',
  canExC01: '71292',
  canExC02: '30cc1',
  canc3C01: '385b7',
  canc3C02: '913e9',
  canc3C03: 'bdb11',
  canc3C04: '4ba86',
  canc3C05: 'd0287',
  canc3C06: '3ca23',
  canc3C07: '02561',
  canc3C08: '080f9',
  canc3C09: 'a8e75',
  canc3C10: '06268',
  canc3C11: 'aee7c',
  canc3D01: '2ce11',
  canc3D02: '0861b',
  canc3D03: 'e3b7d',
  canc3M01: 'd0314',
  canc3M02: 'cb91f',
  canc3N01: 'f7ad2',
  canc3N02: 'fc190',
  canc3N03: '44f8c',
  canc3N04: 'de7d5',
  canc3N05: '42453',
  techno1E2: 'e38d8',
  techno1P1: 'c988f',
  techno1P2: 'eb1e8',
  'techno1P2-1': 'a66ad',
  'techno1P2-2': '86f71',
  techno1P3: 'c7270',
  techno1P4: 'f0c23',
  techno1P5: '5b5c0',
  techno1P8: '1aad3'
}

const idExercicesDisponibles = Object.keys(refToUuid)

function TestAllPages (idExercicesDisponibles) {
  for (const id of idExercicesDisponibles) {
    test(`Exercice avec correction et 10 actualisations ${id}`, async ({ page }) => {
      const messages: string[] = []
      await page.goto('http://localhost:5173/beta/')
      await page.locator('[placeholder="Identifiant d\\\'exercice"]').click()
      // Fill [placeholder="Identifiant d\'exercice"]
      await page.locator('[placeholder="Identifiant d\\\'exercice"]').fill(id)
      // Press Enter
      await page.locator('[placeholder="Identifiant d\\\'exercice"]').press('Enter')
      // Listen for all console events and handle errors
      page.on('console', msg => {
        if (!msg.text().includes('[vite]')) {
          messages.push(msg.text())
          console.log(msg.text())
        }
      })
      // Correction
      await page.locator('.bx-check-circle').first().click()
      // Actualiser
      await page.locator('.bx-refresh').first().click({ clickCount: 10 })
      // Paramètres
      await page.locator('.bx-cog').first().click()
      expect(messages.length).toBe(0)
    })
  }
}
TestAllPages(idExercicesDisponibles)
