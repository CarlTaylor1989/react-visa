export const indexPath = '/';
export const splashPath = '/splash';
export const diagnosticPath = '/diagnostic';
export const introSequencePath = '/introseq';
export const gamePath = '/game';
export const networkPath = `${gamePath}/network`;
export const networkMapPath = `${networkPath}/map`;
export const networkProductPath = `${networkPath}/product`;
export const clientsPropsPath = `${gamePath}/clientproposals`;
export const clientsSelectorPath = `${clientsPropsPath}/selector`;
export const proposalPath = `${clientsPropsPath}/proposal`;

export const sequence = [
  {
    url: indexPath
  },
  {
    url: splashPath
  },
  {
    url: diagnosticPath
  },
  {
    url: introSequencePath
  },
  {
    url: gamePath,
    subpages: [{
      url: networkPath
    }, {
      url: clientsPropsPath
    }],
  }
];
