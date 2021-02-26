import React, { useState } from 'react';
import styled from 'styled-components';
import { useStaticQuery, graphql } from 'gatsby';

const StyledSpeakingSection = styled.section`
  max-width: 900px;

  .talks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
    display: flex;
    align-items: center;
    text-align: center;
  }
`;
const StyledTalkCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 20px;
  padding: 5% 3%;
  border: 2px solid var(--green);
  background-color: var(--navy);
  color: #fff;
  margin-top: 30px;

  .inner {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 15px;

    .date {
      margin-bottom: 20px;
    }

    @media only screen and (max-width: 768px) {
      .location {
        font-size: 17px;
      }
    }
  }

  .inner-divide {
    display: flex;
    align-items: flex-start;
    margin-top: 15px;

    > span + span {
      margin-left: 10px;
    }
  }

  span {
    font-size: 16px;
    color: var(--green);
    font-weight: bold;
  }

  .small-text {
    text-decoration: underline;
  }

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  h4 {
    font-size: clamp(16px, 2.5vw, var(--fz-heading));
  }
`;

const Speaking = () => {
  const data = useStaticQuery(graphql`
    query {
      talks: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/talks/" }
          frontmatter: { showInProjects: { ne: false } }
        }
        sort: { fields: [frontmatter___Date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              conference
              talkTitle
              Date
              Location
              Slides
              Video
              Website
            }
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const talks = data.talks.edges.filter(({ node }) => node);
  //console.log(talks)
  const talk_grid_limit = 6;
  const first_six_talks = talks.slice(0, talk_grid_limit);
  const talks_to_display = showMore ? talks : first_six_talks;

  return (
    <StyledSpeakingSection>
      <h2 className="numbered-heading">Some Talks I've Given</h2>
      {talks_to_display &&
        talks_to_display.map(({ node }, i) => {
          const { frontmatter } = node;
          const { conference, talkTitle, Date, Location, Slides, Video, Website } = frontmatter;

          return (
            <StyledTalkCard key={i}>
              <div key={i} className="inner">
                {Date && <span className="date">{Date}</span>}
                {conference && (
                  <h4>
                    <a target="_blank" href={Website} rel="noreferrer">
                      {conference}{' '}
                    </a>
                  </h4>
                )}
                {talkTitle && <h2>{talkTitle}</h2>}
                {Location && <p className="location">{Location}</p>}
                <div className="inner-divide">
                  {Slides && (
                    <span>
                      <a
                        className="small-text"
                        href={Slides}
                        aria-label="Conference Slides"
                        target="_blank"
                        rel="noreferrer">
                        View slides
                      </a>
                    </span>
                  )}
                  {Video && (
                    <span>
                      <a
                        className="small-text"
                        href={Video}
                        aria-label="Conference Video"
                        target="_blank"
                        rel="noreferrer">
                        View video
                      </a>
                    </span>
                  )}
                </div>
              </div>
            </StyledTalkCard>
          );
        })}

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>
    </StyledSpeakingSection>
  );
};

export default Speaking;
