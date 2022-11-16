import React, { useState, useEffect } from "react";
import AccountDeleteForm from "../AccountDeleteForm";
import AccountForm from "../AccountForm";
import CsvExporter from "../../models/CsvExporter";
import Match from "../../models/Match";
import FileUtil from "../../models/FileUtil";
import MatchRankImage from "../MatchRankImage";
import {rankSubTierFor} from "../MatchRankImage";
import HeroImage from "../HeroImage";
import "./AccountListItem.css";
import Account from "../../models/Account";
import Season from "../../models/Season";
import { Flex, Tooltip } from "@primer/components";
import { Hero } from "../../models/Hero";
import { showSaveDialog } from "../../utils/electronUtils";
import LinkButton from "../LinkButton";
import BattletagButton from "./BattletagButton";
import AccountListItemStyle from "./AccountListItemStyle";
import ButtonShownOnHover from "./ButtonShownOnHover";
import RankButton from "./RankButton";
import AccountMeta from "./AccountMeta";
import Separator from "./Separator";
import AccountAvatarStack from "./AccountAvatarStack";

interface Props {
  account: Account;
  onAccountChange: (id: string) => void;
  onAccountUpdate: () => void;
  onPageChange: (activePage: string, val1?: any, val2?: any) => void;
  season: Season;
}

const AccountListItem = ({
  account,
  onAccountChange,
  season,
  onAccountUpdate,
  onPageChange
}: Props) => {
  const [totalMatches, setTotalMatches] = useState(-1);
  const [showEditForm, setShowEditForm] = useState(false);
  const [battletag, setBattletag] = useState(account.battletag);
  const [latestMatch, setLatestMatch] = useState<Match | null>(null);
  const [topHeroes, setTopHeroes] = useState<Hero[]>([]);

  useEffect(() => {
    async function getLatestMatch() {
      const match = await account.latestMatch(season);
      setLatestMatch(match || null);
    }

    async function getTotalMatches() {
      const count = await account.totalMatches(season);
      setTotalMatches(count);
    }

    async function getTopHeroes() {
      const newTopHeroes = await account.topHeroes(season);
      setTopHeroes(newTopHeroes);
    }

    getLatestMatch();
    getTotalMatches();
    getTopHeroes();
  }, [account, account._id, season]);

  const wipeSeason = async () => {
    if (totalMatches < 0) {
      return;
    }

    const unit = totalMatches === 1 ? "match" : "matches";
    const message = `Are you sure you want to delete all ${totalMatches} ${unit} from season ${season.number} for ${account.battletag}? This cannot be undone.`;
    if (!window.confirm(message)) {
      return;
    }

    await Match.wipeSeason(account._id, season);

    const match = await account.latestMatch(season);
    setLatestMatch(match || null);

    const count = await account.totalMatches(season);
    setTotalMatches(count);

    const newTopHeroes = await account.topHeroes(season);
    setTopHeroes(newTopHeroes);
  };

  const exportSeasonTo = async (path: string) => {
    if (!account.battletag) {
      return;
    }
    const exporter = new CsvExporter(
      path,
      season,
      account._id,
      account.battletag
    );

    await exporter.export();
    console.log(`exported ${account.battletag}'s season ${season.number}`, path);
  };

  const exportSeason = async () => {
    if (!account.battletag) {
      return;
    }
    const defaultPath = FileUtil.defaultCsvExportFilename(
      account.battletag,
      season
    );
    const options = { defaultPath };

    const dialogResult = await showSaveDialog(options);
    const canceled = dialogResult.canceled as boolean;
    if (canceled) {
      console.log("export cancelled");
      return;
    }

    const filePath = dialogResult.filePath as string;
    console.log(
      "path for export",
      filePath,
      "season",
      season,
      "account",
      account.battletag
    );
    exportSeasonTo(filePath);
  };

  const accountUpdated = (newBattletag: string) => {
    onAccountUpdate();
    setBattletag(newBattletag);
    setShowEditForm(false);
  };

  const { _id } = account;
  const haveLatestRank = latestMatch && typeof latestMatch.rank === "number";
  const haveLatestResult = latestMatch && latestMatch.result;

  return (
    <AccountListItemStyle>
      <Flex justifyContent="space-between" alignItems="center">
        <div className="width-full mb-2 mt-1">
          <Flex justifyContent="space-between" alignItems="center">
            {showEditForm ? (
              <>
                <AccountForm
                  _id={_id}
                  battletag={battletag}
                  totalAccounts={1}
                  onUpdate={accountUpdated}
                />
                <LinkButton onClick={() => setShowEditForm(!showEditForm)}>
                  Cancel rename
                </LinkButton>
              </>
            ) : (
              <BattletagButton onClick={() => onAccountChange(_id)}>
                {battletag}
              </BattletagButton>
            )}
            <AccountDeleteForm
              id={_id}
              onDelete={() => onAccountUpdate()}
              battletag={battletag}
            />
          </Flex>
          <AccountMeta>
            {haveLatestResult && !haveLatestRank && latestMatch && (
              <span>Last match: {latestMatch.result}</span>
            )}
            {latestMatch && latestMatch.playedAt ? (
              <>
                {haveLatestResult && !haveLatestRank && <Separator />}
                Last played {latestMatch.playedAt.toLocaleDateString()}
              </>
            ) : latestMatch && latestMatch.createdAt ? (
              <>
                {haveLatestResult && !haveLatestRank && <Separator />}
                Last logged {latestMatch.createdAt.toLocaleDateString()}
              </>
            ) : null}
            {totalMatches > 0 ? (
              <>
                <Separator />
                <span>
                  {totalMatches} match{totalMatches === 1 ? null : "es"}
                </span>
              </>
            ) : (
              <span>No matches in season {season.number}</span>
            )}
          </AccountMeta>
          <ButtonShownOnHover onClick={() => setShowEditForm(!showEditForm)}>
            Rename account
          </ButtonShownOnHover>
          {totalMatches > 0 ? (
            <>
              <ButtonShownOnHover
                ml={3}
                aria-label="Save season as a CSV file"
                onClick={exportSeason}
              >
                Export season {season.number}
              </ButtonShownOnHover>
              <ButtonShownOnHover ml={3} onClick={wipeSeason}>
                Delete matches
              </ButtonShownOnHover>
            </>
          ) : (
            <ButtonShownOnHover
              ml={3}
              onClick={() => onPageChange("import", _id)}
            >
              Import matches
            </ButtonShownOnHover>
          )}
        </div>
        <Flex alignItems="center">
          {haveLatestRank && latestMatch && (
            <RankButton onClick={() => onAccountChange(account._id)}>
              {typeof latestMatch.rank === "number" && (
                <MatchRankImage
                  rank={latestMatch.rank}
                  className="d-inline-block"
                />
              )}
              <h3 className="h4 text-normal lh-condensed text-gray-dark my-0">
                {typeof latestMatch.rank === "number" ? rankSubTierFor(latestMatch.rank):<span>&mdash;</span>}
              </h3>
            </RankButton>
          )}
          <div className="ml-3 text-right">
            {topHeroes && topHeroes.length > 0 && (
              <Tooltip direction="n" aria-label={topHeroes.join(", ")}>
                <AccountAvatarStack threePlus={topHeroes.length >= 3}>
                  {topHeroes.map(hero => (
                    <HeroImage key={hero} hero={hero} size={40} />
                  ))}
                </AccountAvatarStack>
              </Tooltip>
            )}
          </div>
        </Flex>
      </Flex>
    </AccountListItemStyle>
  );
};

export default AccountListItem;
