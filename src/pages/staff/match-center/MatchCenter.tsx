import MatchCenterSubNavbar from '../../../component/staff/match-center/MatchCenterSubNavbar';
import SEO from '../../../utils/SEO';

const MatchCenter = () => {
  return (
    <>
      <SEO
        mainData={{
          title: 'Match Center - Kickside Rwanda',
          description:
            'Stay updated with the latest matches and scores in our Match Center.',
        }}
      />
      <div>
        <MatchCenterSubNavbar />
        <h1>Match Center</h1>
      </div>
    </>
  );
};

export default MatchCenter;
